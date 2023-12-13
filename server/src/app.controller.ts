import { Body, Controller, Post } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { AppService } from './app.service';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Post('/login')
  async login(@Body('token') token): Promise<any> {
    const ticket = await client.verifyIdToken({
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
}
