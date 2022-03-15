import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware'
import { StoicIdentity } from "ic-stoic-identity";
import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
// @ts-ignore
import { Allotment, Canister, idlFactory, Proposal, Vote } from '../canisters/vote/vote.did.js';
import LocalCanisterIDs from '../canisters/vote/local.json';
import MainnetCanisterIDs from '../canisters/vote/mainnet.json';
import { Principal } from '@dfinity/principal';

const isLocal = window.location.host.includes('localhost');
const canisterId = isLocal ? LocalCanisterIDs.vote.local : '';
const host = isLocal ? "http://localhost:8000" : 'ic0.app';

interface Store {
    actor?          : ActorSubclass<Canister>;
    principal?      : Principal;
    connected       : boolean;
    connecting      : boolean;
    idempotentConnect: () => null | (() => void);
    stoicConnect    : () => void;
    plugConnect     : () => void;
    disconnect      : () => void;

    list?           : Allotment[];
    proposal?       : Proposal;
    proposals       : Proposal[];
    votes           : Vote[];
    fetchProposals  : () => void;
    fetchProposal   : () => void;
    fetchList       : () => void;
    fetchVotes      : () => void;
};

const useStore = create<Store>(subscribeWithSelector((set, get) => ({


    // Canister and Wallet connection

    actor: undefined,
    connected: false,
    connecting: false,

    idempotentConnect () {
        const { connecting } = get();
        if (connecting) return null;
        set({ connecting: true })
        return () => set({ connecting: false });
    },

    async stoicConnect () {

        const complete = get().idempotentConnect()
        if (complete === null) return;

        StoicIdentity.load().then(async (identity : any) => {
            if (identity !== false) {
              // ID is a already connected wallet!
            } else {
              // No existing connection, lets make one!
              identity = await StoicIdentity.connect();
            };

            const agent = new HttpAgent({
                identity,
                host,
            });

            isLocal && agent.fetchRootKey();

            // Create an actor canister
            const actor = Actor.createActor<Canister>(idlFactory, {
                agent,
                canisterId,
            });

            complete();
            set(() => ({ actor, connected: true, principal: identity.getPrincipal() }));
        });
    },

    async plugConnect () {

        const complete = get().idempotentConnect()
        if (complete === null) return;

        // If the user doesn't have plug, send them to get it!
        if (window?.ic?.plug === undefined) {
            window.open('https://plugwallet.ooo/', '_blank');
            return;
        }
        
        await window.ic.plug.requestConnect({ whitelist: [canisterId], host }).catch(complete);

        const agent = await window.ic.plug.agent;
        isLocal && agent.fetchRootKey();
        const principal = await agent.getPrincipal();

        const actor = await window?.ic?.plug?.createActor<Canister>({
            canisterId,
            interfaceFactory: idlFactory,
        });

        complete();
        set(() => ({ actor, connected: true, principal }));
    },

    disconnect () {
        StoicIdentity.disconnect();
        window.ic?.plug?.deleteAgent();
        set({ connected: false, principal: undefined, actor: undefined });
    },

    // Store initialization

    init () {},

    // App things

    proposals: [],
    votes: [],

    async fetchProposals () {
        const { actor } = get();
        if (!actor) return;
        const proposals = await actor.readProposals();
        set({ proposals })
    },

    async fetchProposal () {
        const { actor } = get();
        if (!actor) return;
        const proposal = (await actor.readProposal(0))[0];
        set({ proposal })
    },

    async fetchList () {
        const { actor } = get();
        if (!actor) return;
        const list = (await actor.readList(0))[0];
        set({ list });
    },

    async fetchVotes () {
        const { actor } = get();
        if (!actor) return;
        const votes = await actor.getVotes(0);
        // @ts-ignore: dfx doesn't generate result types properly...
        if (votes.ok) set({ votes: votes.ok });
    }

})));

export default useStore;

// This is the stuff that plug wallet extension stuffs into the global window namespace.
// I stole this for Norton: https://github.com/FloorLamp/cubic/blob/3b9139b4f2d16bf142bf35f2efb4c29d6f637860/src/ui/components/Buttons/LoginButton.tsx#L59
declare global {
    interface Window {
        ic?: {
            plug?: {
                agent: any;
                createActor: <T>(args : {
                    canisterId          : string,
                    interfaceFactory    : IDL.InterfaceFactory,
                }) => ActorSubclass<T>,
                isConnected : () => Promise<boolean>;
                createAgent : (args?: {
                    whitelist   : string[];
                    host?       : string;
                }) => Promise<undefined>;
                requestBalance: () => Promise<
                    Array<{
                        amount      : number;
                        canisterId  : string | null;
                        image       : string;
                        name        : string;
                        symbol      : string;
                        value       : number | null;
                    }>
                >;
                requestTransfer: (arg: {
                    to      : string;
                    amount  : number;
                    opts?   : {
                        fee?            : number;
                        memo?           : number;
                        from_subaccount?: number;
                        created_at_time?: {
                            timestamp_nanos: number;
                        };
                    };
                }) => Promise<{ height: number }>;
                requestConnect: (opts: any) => Promise<'allowed' | 'denied'>;
                deleteAgent: () => Promise<void>;
            };
        };
    }
}