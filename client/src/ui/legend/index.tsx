import React from 'react'
import Spinner from '../../ui/spinner';
import useStore from '../../stores';
import Button from '../button';
import Styles from './styles.module.css'
import { Principal } from '@dfinity/principal';
// @ts-ignore
import { principalToAccountIdentifier } from '../../aid'

interface Props {
    children?: React.ReactNode;
    id: number;
}

export default function Legend (props : Props) {
    const {
        actor,
        list,
        votes,
        principal,
        fetchVotes,
    } = useStore();

    const allocation = React.useMemo(() => {
        if (!list || !principal) return undefined;
        return list.find(a => {
            if ((a[0] as { Principal : Principal }).Principal) {
                return (a[0] as { Principal : Principal }).Principal.toText() === principal.toText()
            } else {
                return (a[0] as { Address : string }).Address === principalToAccountIdentifier(principal.toText(), 0);
            }
        })?.[1] || 0
    }, [list, principal]);

    const [voting, setVoting] = React.useState<boolean>(false);
    
    // @ts-ignore: dfx variant types give ts trouble it seems
    const vote = React.useMemo(() => votes.find(v => v[2]?.Nat8Content === props.id), [votes]);

    async function castVote () {
        if (!actor) return;
        setVoting(true);
        // NOTE: We are assuming one proposal with ID 0 which expects a Nat8 response.
        await actor.vote(0, { 'Nat8Content': props.id }).catch(() => {
            alert('Something went wrong. Please try again.');
            setVoting(false);
        });
        fetchVotes();
        setVoting(false);
    };

    return <div className={Styles.root}>
        {props?.children}
        {vote
            ? <div style={{margin: '0 1em 1em'}}>You picked this Legend!</div>
            : voting
                ? <div style={{margin: '0 1em 1em'}}><Spinner /></div>
                : allocation && allocation - votes.length > 0
                    ? <div>
                        <div style={{margin: '0 1em .5em'}}><Button onClick={castVote} size={'large'}>Let this be my choice</Button></div>
                        <div style={{margin: '0 1em 1em'}}>{(allocation || 0) - votes.length} of {allocation} picks remaining.</div>
                    </div>
                    : <div style={{margin: '0 1em 1em'}}>You are out of picks</div>
        }
    </div>
}