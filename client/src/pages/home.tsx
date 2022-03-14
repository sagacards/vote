import React from 'react'
import { Navigate } from 'react-router-dom';
import Spinner from '../ui/spinner';
import useStore from '../stores/index'
import Button from '../ui/button'

export default function HomePage () {
    const { stoicConnect, plugConnect, connecting, connected } = useStore();
    
    if (connected) return <Navigate to="/proposals" />
    if (connecting) return <div className="rag main"><Spinner /></div>
    
    return <div className="rag main">
        <p>Connect your wallet to choose your legend.</p>
        <br />
        <Button onClick={stoicConnect}>Stoic</Button>
        <Button onClick={plugConnect}>Plug</Button>
    </div>
};