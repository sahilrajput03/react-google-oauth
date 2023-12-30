import './App.css';
import { GoogleOAuthProvider, GoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
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

function ExampleGoogleOAuthProvider() {
  const { authData, setAuthData } = useStore();

  // Using zustand selectors:
  // const authData = useStore((state: any) => state.authData);
  // const setAuthData = useStore((state: any) => state.setAuthData);

  const isLoggedIn = authData && authData?.name;

  function updateAuthData(data: { name: any; email: any; image: any; }) {
    // Note: Save `authData` to local storage
    localStorage.setItem('authData', JSON.stringify(data));
    setAuthData(data);
  }

  return (
    <div className='App'>
      {!isLoggedIn &&
        <GoogleOAuthProvider clientId={clientId}>
          <div>
            <GoogleLogin
              // NOTE: In my most recent I found that the error I was getting about "domain-not-allowed-for-this-clientID" has gone on its own, 
              // probably because it was just some cache error OR GCP takes time to update their server for 15-20mins after
              // we update the "Authorized Javascript Origin" & "Authorized redirect URIs"
              // Docs 1 - Google: https://developers.google.com/identity/gsi/web/guides/subdomains
              // Docs 2 - Npm: https://www.npmjs.com/package/@react-oauth/google
              // state_cookie_domain="vercel.app"

              // NOTE: We can enable below `useOneTap` field to allow sign up new users without interrupting them with a sign-up screen. 
              //       Desktop: It shows a modal in top-right saying "Continue as nameOfUser"
              //       Mobile: It shows selector that pops up from the bottom of the scren to select the account you want to use to login.
              // useOneTap
              onSuccess={async (credentialResponse) => {
                // NOTE: Urgent: Temporarily decoding it here only but for prouduction we would want to create user entry in backend.
                console.log('credentialResponse?', credentialResponse);
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
                // TODO: URGENT: Use this for production i.e, use data that is fetched from our backend server after user is created in backend server.
                // const response = await axios.post(
                //   'http://localhost:3001/login',
                //   {
                //     token: credentialResponse.credential,
                //   }
                // );
                // const data = response.data;
                // console.log('data?', data);
                /* OUTPUT:
                {
                  "name": "Sahil Rajput",
                  "email": "sahil@lucify.in",
                  "image": "https://lh3.googleusercontent.com/a/ACg8ocJEuGlN-o6WzpDGTFWtG0RGrmQ1cz1VIY59EJ2tse2PZA=s96-c",
                  "_id": "XXXXXXXXXXXXXXXXXXXXXXXX",
                  "__v": 0
                }
                 */

                // TODO: URGENT: Remove below because we are temporarily decoding and using credentials directly in frontend.
                const userDetails = parseJwt(credentialResponse.credential!)
                const data = { name: userDetails.name, email: userDetails.email, image: userDetails.picture }

                updateAuthData(data)
              }}

              // ux_mode='redirect' // Allowed values: 'popup' (default), 'redirect 

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

export default ExampleGoogleOAuthProvider;
