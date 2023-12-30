import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initOAuth2Client } from './initGoogleOauth';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const GOOGLE_CLIENT_ID = config.get('GOOGLE_CLIENT_ID');
  const GOOGLE_CLIENT_SECRET = config.get('GOOGLE_CLIENT_SECRET');
  const GOOGLE_REDIRECT_URL = config.get('GOOGLE_REDIRECT_URL');

  // Initiate Google OAuth Client
  initOAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL);

  app.enableCors({
    origin: 'http://localhost:3000',
  });
  await app.listen(3001);
}
bootstrap();
