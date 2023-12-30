import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import ExampleUseGoogleLoginHook from './ExampleUseGoogleLoginHook'
import ExampleGoogleOAuthProvider from './ExampleGoogleOAuthProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* Note: For handling the token in backend by providing the redirect_uri */}
    <ExampleUseGoogleLoginHook />

    {/* Note: For handling the token in browser */}
    {/* <ExampleGoogleOAuthProvider /> */}
  </React.StrictMode>
)
