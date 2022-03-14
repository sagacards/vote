import React from 'react'
import Styles from './styles.module.css'
import Anvil from '../../assets/anvil.png'

interface Props {
    children?: React.ReactNode;
}

export default function Top (props : Props) {
    return <div className={Styles.root}>
        <h1 className={Styles.title}>Choose your legend</h1>
        <p className={Styles.subtitle}>4 Legends, 4 private minting events, your choice.</p>
        <img src={Anvil} className={Styles.anvil} />
    </div>
}