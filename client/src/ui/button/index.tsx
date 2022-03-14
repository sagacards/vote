import React from 'react'
import Styles from './styles.module.css'

interface Props {
    children?: React.ReactNode;
    onClick: (e: React.MouseEvent) => void;
    size?: 'small' | 'large';
}

export default function Button (props : Props) {
    return <div className={[Styles.root, props.size ? Styles[`size-${props.size}`] : ''].join(' ')} onClick={props.onClick}>
        {props.children}
    </div>
}