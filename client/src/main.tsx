import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { WalletProvider } from './context/WalletContext.tsx'
//0x5FbDB2315678afecb367f032d93F642f64180aa3
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <WalletProvider>

      <App />
    </WalletProvider>
      </BrowserRouter>
  
  </StrictMode>,
)
