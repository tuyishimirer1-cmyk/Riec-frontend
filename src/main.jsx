import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import './i18n/i18n'
import App from './App.jsx'
import { QueryProvider } from './react-query/QueryProvider'

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <QueryProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryProvider>
  </HelmetProvider>
)
