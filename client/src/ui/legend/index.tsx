import React from 'react'
import Button from '../button';
import Styles from './styles.module.css'

interface Props {
    children?: React.ReactNode;
    id: number;
}

export default function Legend (props : Props) {
    return <div className={Styles.root}>
        {props?.children}
        <div style={{margin: '0 1em 1em'}}><Button onClick={console.log} size={'large'}>Let this be my choice</Button></div>
    </div>
}