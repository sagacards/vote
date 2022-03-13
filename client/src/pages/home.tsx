import React from 'react'
import { Navigate } from 'react-router-dom';
import useStore from '../stores/index'
import Button from '../ui/button'

export default function HomePage () {
    const { stoicConnect, plugConnect, connecting, connected } = useStore();
    
    if (connected) return <Navigate to="/proposals" />
    
    return <div>
        <h1>Saga Proposals</h1>
        <p>Connect your wallet to make your voice heard in the open tarot project on Internet Computer.</p>
        {connecting ? <>
            <></>
        </> : <>
            <Button onClick={stoicConnect}>Stoic</Button>
            <Button onClick={plugConnect}>Plug</Button>
        </>}
    </div>
};