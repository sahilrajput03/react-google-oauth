import './App.css';
import { GoogleOAuthProvider, GoogleLogin, useGoogleOneTapLogin, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

import { useStore } from './hooks/useStore';
import Profile from './components/Profile';

const clientId = import.meta.env.VITE_CLIENT_ID
console.log('clientId (from environment variables)?', clientId);



// Source: https://stackoverflow.com/a/38552302/10012446
function parseJwt(token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

function Login() {
  const { authData, setAuthData } = useStore();

  // function updateAuthData(data: { name: any; email: any; image: any; }) {
  //   // Note: Save `authData` to local storage
  //   localStorage.setItem('authData', JSON.stringify(data));
  //   setAuthData(data);
  // }

  const handleLogin: any = useGoogleLogin({
    ux_mode: 'redirect',
    // redirect_uri: 'http://localhost:3000/auth/callback',
    redirect_uri: 'http://localhost:3001/auth/google/callback',
    flow: 'auth-code'
  });

  return <button onClick={handleLogin}>Sign in with Google 🚀</button>
}


function ExampleUseGoogleLoginHook() {
  const { authData, setAuthData } = useStore();

  const isLoggedIn = authData && authData?.name;

  return (
    <div className='App'>
      {!isLoggedIn &&
        <GoogleOAuthProvider clientId={clientId}>
          <Login />
        </GoogleOAuthProvider>
      }
      <Profile />
    </div>
  );
}

export default ExampleUseGoogleLoginHook;
