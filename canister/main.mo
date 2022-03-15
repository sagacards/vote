import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat16 "mo:base/Nat16";
import Nat32 "mo:base/Nat32";
import Result "mo:base/Result";


shared ({ caller = creator }) actor class Canister() {


    ////////////
    // Types //
    //////////


    type GenericType = {
        #BoolContent;
        #TextContent;
        #BlobContent;
        #Principal;
        #NatContent;
        #Nat8Content;
        #Nat16Content;
        #Nat32Content;
        #Nat64Content;
        #IntContent;
        #Int8Content;
        #Int16Content;
        #Int32Content;
        #Int64Content;
    };

    type GenericValue = {
        #BoolContent    : Bool;
        #TextContent    : Text;
        #BlobContent    : [Nat8];
        #Principal      : Principal;
        #NatContent     : Nat;
        #Nat8Content    : Nat8;
        #Nat16Content   : Nat16;
        #Nat32Content   : Nat32;
        #Nat64Content   : Nat64;
        #IntContent     : Int;
        #Int8Content    : Int8;
        #Int16Content   : Int16;
        #Int32Content   : Int32;
        #Int64Content   : Int64;
    };

    type ProposalID = Nat32;

    type Proposal = {
        id          : ProposalID;
        title       : Text;
        voteType    : GenericType;
    };

    type Vote = (ProposalID, Principal, GenericValue);

    type Allotment = (Principal, Nat16);

    type Error = {
        #VoteUnauthorized: ?Text;
        #VoteMax: ?Text;
        #VoteWrongType: ?Text;
        #ProposalNotFound: ?Text;
        #Unauthorized;
    };


    ////////////
    // State //
    //////////


    var admin = creator;

    let meta = {
        name = "Saga Legends Proposals";
    };

    let proposals = HashMap.HashMap<ProposalID, Proposal>(0, Nat32.equal, func (a) { a });
    let votes = HashMap.HashMap<ProposalID, Buffer.Buffer<Vote>>(0, Nat32.equal, func (a) { a });
    let lists = HashMap.HashMap<ProposalID, [Allotment]>(0, Nat32.equal, func (a) { a });

    stable var propID : Nat32 = 0;

    // Persist state through upgrades

    stable var stableProps : [(ProposalID, Proposal)] = [];
    stable var stableVotes : [(ProposalID, [Vote])] = [];
    stable var stableLists : [(ProposalID, [Allotment])] = [];

    system func preupgrade () {
        stableProps := Iter.toArray(proposals.entries());
        stableVotes := Array.map<(ProposalID, Buffer.Buffer<Vote>), (ProposalID, [Vote])>(
            Iter.toArray(votes.entries()),
            func (a) {
                (a.0, a.1.toArray());
            }
        );
        stableLists := Iter.toArray(lists.entries());
    };

    for ((k, v) in stableProps.vals()) {
        proposals.put(k, v);
    };

    for ((k, v) in stableVotes.vals()) {
        let buff = Buffer.Buffer<Vote>(v.size());
        for (vv in v.vals()) {
            buff.add(vv);
        };
        votes.put(k, buff);
    };

    for ((k, v) in stableLists.vals()) {
        lists.put(k, v);
    };


    ////////////////
    // Admin API //
    //////////////


    public shared ({ caller }) func createProposal (
        title   : Text,
        voteType: GenericType,
    ) : async Result.Result<(), Error> {
        if (caller != admin) {
            return #err(#Unauthorized);
        };
        proposals.put(propID, {
            id = propID;
            title;
            voteType;
        });
        votes.put(propID, Buffer.Buffer<Vote>(0));
        lists.put(propID, []);
        propID += 1;
        #ok();
    };

    public query func readProposal (
        id: ProposalID
    ) : async ?Proposal {
        proposals.get(id);
    };

    public query func readProposals () : async [Proposal] {
        Iter.toArray(proposals.vals());
    };

    public shared ({ caller }) func updateProposal (
        id      : ProposalID,
        title   : ?Text,
        voteType: ?GenericType,
    ) : async Result.Result<?Proposal, Error> {
        if (caller != admin) {
            return #err(#Unauthorized);
        };
        #ok(do ? {
            let prop = proposals.get(id)!;
            switch (title) {
                case (?t) proposals.put(id, { id; title = t; voteType = prop.voteType; });
                case _ ();
            };
            switch (voteType) {
                case (?v) proposals.put(id, { id; title = prop.title; voteType = v; });
                case _ ();
            };
            prop;
        });
    };

    public shared ({ caller }) func deleteProposal (
        id: ProposalID,
    ) : async Result.Result<(), Error> {
        if (caller != admin) {
            return #err(#Unauthorized);
        };
        proposals.delete(id);
        #ok()
    };

    public shared ({ caller }) func setAdmin (
        newAdmin : Principal
    ) : async Result.Result<(), Error> {
        if (caller != admin) {
            return #err(#Unauthorized);
        };
        admin := newAdmin;
        #ok();
    };

    // Lists

    public shared ({ caller }) func createList (
        proposal    : ProposalID,
        list        : [Allotment],
    ) : async Result.Result<(), Error> {
        if (caller != admin) {
            return #err(#Unauthorized);
        };
        lists.put(proposal, list);
        #ok();
    };

    public query func readList (
        proposal    : ProposalID,
    ) : async ?[Allotment] {
        lists.get(proposal);
    };


    ///////////////////
    // Consumer API //
    /////////////////


    public shared ({ caller }) func vote (
        proposal    : ProposalID,
        vote        : GenericValue,
    ) : async Result.Result<(), Error> {

        switch (
            proposals.get(proposal),
            votes.get(proposal),
            lists.get(proposal),
        ) {

            case (?proposal, ?votes, ?list) {
                
                switch (Array.find<Allotment>(list, func ((p, _)) { p == caller })) {
                    case (?allot) {
                        if (Nat16.fromNat(Array.filter<Vote>(votes.toArray(), func (a) { a.1 == caller }).size()) >= allot.1) {
                            #err(#VoteMax(?"You have issued the maximum number of votes."));
                        } else {
                            // TODO: Type check votes
                            votes.add((proposal.id, caller, vote));
                            #ok();
                        };
                    };
                    case _ #err(#VoteUnauthorized(?"You are not authorized to vote on this proposal."));
                };

            };
            case _ #err(#ProposalNotFound(?"That proposal does not exist."));
        };

    };

    public query ({ caller }) func getVotes (
        proposal : ProposalID,
    ) : async Result.Result<[Vote], Error> {
        switch (votes.get(proposal)) {
            case (?votes) {
                #ok(Array.filter<Vote>(votes.toArray(), func (v) { v.1 == caller }));
            };
            case _ #err(#ProposalNotFound(?"That Proposal does not exist."));
        }
    };

}