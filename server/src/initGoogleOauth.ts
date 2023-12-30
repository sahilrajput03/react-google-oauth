import { OAuth2Client } from 'google-auth-library';

// Google docs on using this library: https://developers.google.com/identity/protocols/oauth2
// Docs: https://www.npmjs.com/package/google-auth-library
export let oAuth2Client = null as null | OAuth2Client;

export const initOAuth2Client = (
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
) => {
  oAuth2Client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL,
  );
};

// Function to fetch user details using the OAuth2 client
type UserDetails = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
  hd: string;
};

export async function getUserDetails() {
  const { data } = await oAuth2Client.request({
    url: 'https://www.googleapis.com/oauth2/v1/userinfo',
  });
  return data as Promise<UserDetails>;
}
