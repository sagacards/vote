import React from 'react'
import useStore from '../../stores/index'
import Spinner from '../../ui/spinner'
import Styles from './styles.module.css'
import Box from '../../ui/box'
import { Navigate } from 'react-router-dom'
import Legend from '../../ui/legend'
import content from '../../assets/content'
import Button from '../../ui/button'
// @ts-ignore
import { principalToAccountIdentifier } from '../../aid'
import { Principal } from '@dfinity/principal'

interface Props {
    children?: React.ReactNode;
}

export default function ProposalsPage(props: Props) {

    const {
        connected,
        list,
        votes,
        principal,
        disconnect,
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

    const [legend, setLegend] = React.useState(0);

    if (!connected) return <Navigate to="/" />

    console.log(allocation, votes);

    return <div className={[Styles.root].join(' ')}>


            {allocation !== undefined && votes !== undefined ? <>
                <div className={Styles.main}>
                    <Box>
                        {allocation === 0
                            ? <>
                                <h2>Access: Restricted 🙈</h2>
                                <p>People from the last minting event get the first crack at this minting event. Any remaining supply will be available to new minters, but there are no guarantees of remaining supply. We look forward to more public minting events in the future.</p>
                            </>
                            : <>
                                <h2>Access: Granted 😁</h2>
                                <p>Your participation in the Magician minting event has secured your spot in this event.</p>
                                <p><strong>Guaranteed Mints: {allocation}</strong></p>
                                {allocation > 1 && <p>
                                    Your generosity in returning the double-refunded ICP to us has earned you a bonus +1 guaranteed mints! Thank you.
                                </p>}
                            </>
                        }
                    </Box>

                    {allocation === 0 && <>
                        <p><small>Are you using the right wallet?</small></p>
                        <Button onClick={disconnect}>Disconnect</Button>
                    </>}

                    {allocation > 0 && allocation - votes.length > 0 && <p>
                        You must now choose which of the four minting events you most want to participate in. You cannot change your votes once made, so choose wisely. Browse the four options and make your choice below.
                    </p>}

                    {votes.length > 0 && <div>
                        {/* @ts-ignore */}
                        You picked: {votes.map(x => content[x?.[2].Nat8Content as unknown as number].title).join(', ')} 
                    </div>}
                </div>

                {allocation > 0 && <div className={Styles.legends}>
                    <div className={Styles.nav}>
                        <div onClick={() => setLegend(0)} className={[Styles.navItem, legend === 0 ? Styles.active : ''].join(' ')}>
                            <span className={Styles.number}>#2</span>
                            The High Priestess
                        </div>
                        <div onClick={() => setLegend(1)} className={[Styles.navItem, legend === 1 ? Styles.active : ''].join(' ')}>
                            <span className={Styles.number}>#3</span>
                            The Empress
                        </div>
                        <div onClick={() => setLegend(2)} className={[Styles.navItem, legend === 2 ? Styles.active : ''].join(' ')}>
                            <span className={Styles.number}>#4</span>
                            The Emperor
                        </div>
                        <div onClick={() => setLegend(3)} className={[Styles.navItem, legend === 3 ? Styles.active : ''].join(' ')}>
                            <span className={Styles.number}>#5</span>
                            The Hierophant
                        </div>
                    </div>

                    <div className={Styles.legendContainer}>
                        <Legend id={legend} key={`legend${legend}`}>
                            <div className={Styles.legendTitle}>
                                {content[legend].title}
                            </div>
                            <div className={Styles.legendPoem}>{content[legend].poem}</div>
                            <video loop={true} autoPlay={true} key={`video${legend}`}>
                                <source src={content[legend].video} />
                            </video>
                            <div className={Styles.legendGeneral}>{content[legend].general}</div>
                        </Legend>
                    </div>
                </div>}

            </> : <div className={Styles.main}><Spinner /></div>}

    </div>
}