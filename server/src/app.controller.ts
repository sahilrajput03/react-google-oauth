import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import {
  getUserDetails as getGoogleUserDetails,
  oAuth2Client,
} from './initGoogleOauth';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private readonly config: ConfigService,
  ) {}

  // ! Note: This route is used when auth flow is handled in frontend.
  @Post('/login')
  async login(@Body('token') token): Promise<any> {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log('payload?', payload);
    /* OUTPUT: payload? 
    {
      iss: 'https://accounts.google.com',
      azp: 'ID_1_HERE',
      aud: 'ID_1_HERE',
      sub: '113316873974551764257',
      hd: 'lucify.in',
      email: 'sahil@lucify.in',
      email_verified: true,
      nbf: 1702472493,
      name: 'Sahil Rajput',
      picture: 'https://lh3.googleusercontent.com/a/ACg8ocJEuGlN-o6WzpDGTFWtG0RGrmQ1cz1VIY59EJ2tse2PZA=s96-c',
      given_name: 'Sahil',
      family_name: 'Rajput',
      locale: 'en-GB',
      iat: 1702472793,
      exp: 1702476393,
      jti: 'ID_2_HERE'
    }
    */

    const data = await this.appService.login(
      payload.email,
      payload.name,
      payload.picture,
    );
    return data;
  }

  // ! Note: This route is used when auth flow is handled in backend.
  @Get('/auth/google/callback')
  async AuthGoogleCallback(@Query() query): Promise<any> {
    console.log('query?', query);
    /* OUTPUT: 
    { code: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      scope: 'email profile openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      authuser: '1',
      hd: 'lucify.in',
      prompt: 'consent' }
     */

    try {
      const { tokens } = await oAuth2Client.getToken(query.code);
      // { access_token, expiry_date, refresh_token, ...more}
      oAuth2Client.setCredentials(tokens);
      // console.log('tokens?', tokens);

      // Use the OAuth2 client to fetch user details
      const user = await getGoogleUserDetails();
      // NOTE: Save all below fields to database.
      //       Also, in future you might want to store access_token, refresh_token, expiry_date, etc as well for fetching details anytime later.
      console.log('name?', user.name);
      console.log('email?', user.email);
      console.log('picture?', user.picture);
      console.log('googleAccountId?', user.id); // googleAccountId
    } catch (error) {
      if (error.response.data.error === 'invalid_grant') {
        // Note: `invalid_grant` means you tried to use the same authorization code to get more than one developer token.
        console.error('PROJECT_ERROR?: Google OAuth Token is expired.');
      }
    }
  }
}

/* 

Requests with Axios (NOT TESTED)

    // Google OAuth configuration
    const googleConfig = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: 'http://localhost:3001/auth/google/callback', // Adjust the URL based on your setup
      scope: 'https://www.googleapis.com/auth/plus.login',
    };
    console.log('googleConfig?', googleConfig);

    // Exchange the authorization code for an access token
    try {
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code,
          client_id: googleConfig.clientId,
          client_secret: googleConfig.clientSecret,
          redirect_uri: googleConfig.redirectUri,
          grant_type: 'authorization_code',
        },
      );
      console.log('tokenResponse?', tokenResponse);
    } catch (error) {
      console.log('error?', error.response.data);
    }

*/
