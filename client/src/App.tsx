import React from 'react'
import HomePage from './pages/home';
import Controller from './stores/controller'
import useStore from './stores/index'
import { Routes, Route } from 'react-router-dom'

function App() {
  const { stoicConnect, plugConnect, proposals, connected, list, votes, proposal, principal } = useStore();

  const allocation = React.useMemo(() => {
    if (!list || !principal) return 0;
    return list.find(a => a[0].toText() === principal.toText())?.[1] || 0
  }, [list, principal]);
  
  return <>
    <Controller />
    <Routes>
      <Route path="/" element={ <HomePage /> } />
    </Routes>
  </>
}

export default App
