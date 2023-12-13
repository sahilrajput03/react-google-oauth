import './App.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useGoogleOneTapLogin } from '@react-oauth/google';

import { useStore } from './hooks/useStore';
import Profile from './components/Profile';

const clientId = import.meta.env.VITE_CLIENT_ID

function App() {
  const { authData, setAuthData } = useStore();

  // With Zustand we can also destructure `authData` and `setAuthData` like that -
  // const authData = useStore((state: any) => state.authData);
  // const setAuthData = useStore((state: any) => state.setAuthData);

  const isLoggedIn = authData && authData?.name;
  return (
    <div className='App'>
      {!isLoggedIn &&
        <GoogleOAuthProvider clientId={clientId}>
          <div>
            <GoogleLogin
              // NOTE: We can enable below `useOneTap` field to allow sign up new users without interrupting them with a sign-up screen. 
              // Desktop: It shows a modal in top-right saying "Continue as nameOfUser"
              // Mobile: It shows selector that pops up from the bottom of the scren to select the account you want to use to login.
              // useOneTap
              onSuccess={async (credentialResponse) => {
                /* credentialResponse (OUTPUT): 
                {
                  "clientId": "id_1_here",
                  "client_id": "id_1_here",
                    Note: `credential` is JWT token which we can decode via `https://jwt.io/` and it has
                    a lot of properties e.g.,
                          "iss", "azp", "aud", "sub", "hd", "email_verified" (boolean), "nbf",
                          "given_name", "family_name", "locale", "iat", "exp", "jti",
                          MOST USEFUL KEYS ARE THESE: "name", "email", "picture"
                  "credential": "JWT_TOKEN_HERE",
                  "select_by": "btn"
                }
                */

                console.log('credentialResponse?', credentialResponse);
                const response = await axios.post(
                  'http://localhost:3001/login',
                  {
                    token: credentialResponse.credential,
                  }
                );
                const data = response.data;
                // `data.credential` is JSON webtoken
                console.log('data?', data);
                /* OUTPUT:
                {
                  "name": "Sahil Rajput",
                  "email": "sahil@lucify.in",
                  "image": "https://lh3.googleusercontent.com/a/ACg8ocJEuGlN-o6WzpDGTFWtG0RGrmQ1cz1VIY59EJ2tse2PZA=s96-c",
                  "_id": "XXXXXXXXXXXXXXXXXXXXXXXX",
                  "__v": 0
                }
                 */

                // Note: Save `authData` to local storage
                localStorage.setItem('authData', JSON.stringify(data));
                setAuthData(data);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </div>

        </GoogleOAuthProvider>
      }
      <Profile />
    </div>
  );
}

export default App;
