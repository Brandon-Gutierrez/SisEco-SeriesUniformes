import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ZIndexProvider } from '../src/context/ZIndexContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ZIndexProvider>
      <App />
    </ZIndexProvider>
  </React.StrictMode>
)