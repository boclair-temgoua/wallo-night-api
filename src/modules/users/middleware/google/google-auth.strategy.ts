import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { config } from '../../../../app/config';
// import { AuthService } from '../auth.service';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: config.implementations.auth.google.clientId,
      clientSecret: config.implementations.auth.google.clientSecret,
      callbackURL: config.implementations.auth.google.clientCallBack,
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    // const user = await this.authService.validateUser({
    //   email: profile.emails[0].value,
    //   displayName: profile.displayName,
    // });
    // console.log('Validate');
    // console.log(user);
    return null;
  }
}
