import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/almendra'
import '@fontsource/almendra-sc'
import '@fontsource/cardo'
import '@fontsource/inter'

const global = (window as any).global = window;

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
