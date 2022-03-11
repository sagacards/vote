import create from 'zustand';
import { StoicIdentity } from "ic-stoic-identity";
import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
// @ts-ignore
import { idlFactory } from './did/vote.did.js';

const canisterId = "sgymv-uiaaa-aaaaa-aaaia-cai";
const host = "localhost:8000";

interface Store {
    actor?: Actor;
    stoicConnect: () => void;
    plugConnect: () => void;
};

const useStore = create<Store>((set, get) => ({

    actor: undefined,

    stoicConnect: async () => {
        StoicIdentity.load().then(async (identity : any) => {
            if (identity !== false) {
              // ID is a already connected wallet!
            } else {
              // No existing connection, lets make one!
              identity = await StoicIdentity.connect();
            };

            // Create an actor canister
            const actor = Actor.createActor(idlFactory, {
                agent: new HttpAgent({
                  identity,
                  host,
                }),
                canisterId,
            });

            set(() => ({ actor }));
        });
    },

    plugConnect: async () => {
        // If the user doesn't have plug, send them to get it!
        if (window?.ic?.plug === undefined) {
            window.open('https://plugwallet.ooo/', '_blank');
            return;
        }
        
        await window.ic.plug.requestConnect({ whitelist: [canisterId], host })
        const actor = await window?.ic?.plug?.createActor({
            canisterId,
            interfaceFactory: idlFactory,
        });

        set(() => ({ actor }));
    },

}));

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