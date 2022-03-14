import React from 'react'
import HomePage from './pages/home';
import Controller from './stores/controller'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProposalsPage from './pages/proposals';
import Top from './ui/top';

function App() {
  
  return <>
    <Controller />
    <Top />
    <Routes>
      <Route path="/" element={ <HomePage /> } />
      <Route path="/proposals" element={ <ProposalsPage /> } />
    </Routes>
  </>
}

export default App
