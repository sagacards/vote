import React from 'react'
import Styles from './styles.module.css'

interface Props {
    children?: React.ReactNode;
    onClick: (e: React.MouseEvent) => void;
}

export default function Button (props : Props) {
    return <div className={Styles.root} onClick={props.onClick}>
        {props.children}
    </div>
}