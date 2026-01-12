import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Global styles from the original site
import './styles/design-tokens.css'
import './styles/page.css'
import './styles/about.css'
import './styles/contact.css'
import './styles/home.css'
import './styles/react-fixes.css'
import './styles/overrides.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
