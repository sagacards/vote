import React from 'react'
import useStore from './store'

function App() {
  const { stoicConnect, plugConnect, actor } = useStore();
  if (actor) {
    console.log(actor);
    // @ts-ignore
    actor.readProposal(0);
  }
  return (
    <div className="App">
      <a href="#" onClick={stoicConnect}>Stoic</a>
      <br />
      <a href="#" onClick={plugConnect}>Plug</a>
    </div>
  )
}

export default App
