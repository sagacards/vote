import React from 'react';
import useStore from '.';

export default function Controller () {
    const { fetchProposals, fetchProposal, fetchList, fetchVotes } = useStore();

    // Fetch proposals as soon as an actor is initialized.

    // @ts-ignore: zustand subscribe api types out of date?
    React.useEffect(() => useStore.subscribe(state => state.actor, () => {
        fetchProposals();
        fetchProposal();
        fetchList();
        fetchVotes();
    }), []);
    
    return <></>
};