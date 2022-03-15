export const idlFactory = ({ IDL }) => {
  const ProposalID = IDL.Nat32;
  const User = IDL.Variant({
    'Address' : IDL.Text,
    'Principal' : IDL.Principal,
  });
  const Allotment = IDL.Tuple(User, IDL.Nat16);
  const Error = IDL.Variant({
    'ProposalNotFound' : IDL.Opt(IDL.Text),
    'VoteMax' : IDL.Opt(IDL.Text),
    'Unauthorized' : IDL.Null,
    'VoteUnauthorized' : IDL.Opt(IDL.Text),
    'VoteWrongType' : IDL.Opt(IDL.Text),
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const GenericType = IDL.Variant({
    'Nat64Content' : IDL.Null,
    'Nat32Content' : IDL.Null,
    'BoolContent' : IDL.Null,
    'Nat8Content' : IDL.Null,
    'Int64Content' : IDL.Null,
    'IntContent' : IDL.Null,
    'NatContent' : IDL.Null,
    'Nat16Content' : IDL.Null,
    'Int32Content' : IDL.Null,
    'Int8Content' : IDL.Null,
    'Int16Content' : IDL.Null,
    'BlobContent' : IDL.Null,
    'Principal' : IDL.Null,
    'TextContent' : IDL.Null,
  });
  const GenericValue = IDL.Variant({
    'Nat64Content' : IDL.Nat64,
    'Nat32Content' : IDL.Nat32,
    'BoolContent' : IDL.Bool,
    'Nat8Content' : IDL.Nat8,
    'Int64Content' : IDL.Int64,
    'IntContent' : IDL.Int,
    'NatContent' : IDL.Nat,
    'Nat16Content' : IDL.Nat16,
    'Int32Content' : IDL.Int32,
    'Int8Content' : IDL.Int8,
    'Int16Content' : IDL.Int16,
    'BlobContent' : IDL.Vec(IDL.Nat8),
    'Principal' : IDL.Principal,
    'TextContent' : IDL.Text,
  });
  const Vote = IDL.Tuple(ProposalID, User, GenericValue);
  const Result_2 = IDL.Variant({ 'ok' : IDL.Vec(Vote), 'err' : Error });
  const Proposal = IDL.Record({
    'id' : ProposalID,
    'title' : IDL.Text,
    'voteType' : GenericType,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Opt(Proposal), 'err' : Error });
  const Canister = IDL.Service({
    'createList' : IDL.Func([ProposalID, IDL.Vec(Allotment)], [Result], []),
    'createProposal' : IDL.Func([IDL.Text, GenericType], [Result], []),
    'deleteProposal' : IDL.Func([ProposalID], [Result], []),
    'getVotes' : IDL.Func([ProposalID], [Result_2], ['query']),
    'readList' : IDL.Func(
        [ProposalID],
        [IDL.Opt(IDL.Vec(Allotment))],
        ['query'],
      ),
    'readProposal' : IDL.Func([ProposalID], [IDL.Opt(Proposal)], ['query']),
    'readProposals' : IDL.Func([], [IDL.Vec(Proposal)], ['query']),
    'setAdmin' : IDL.Func([IDL.Principal], [Result], []),
    'updateProposal' : IDL.Func(
        [ProposalID, IDL.Opt(IDL.Text), IDL.Opt(GenericType)],
        [Result_1],
        [],
      ),
    'vote' : IDL.Func([ProposalID, GenericValue], [Result], []),
  });
  return Canister;
};
export const init = ({ IDL }) => { return []; };
