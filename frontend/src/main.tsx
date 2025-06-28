import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { StacksProvider } from './contexts/StacksContext.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StacksProvider>
        <App />
      </StacksProvider>
    </BrowserRouter>
  </React.StrictMode>,
)