import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
//check
import { VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      clientID: configService.get<string>('MICROSOFT_CLIENT_ID'),
      clientSecret: configService.get<string>('MICROSOFT_CLIENT_SECRET'),
      callbackURL: 'http://localhost:8080/auth/microsoft/callback',
      scope: ['user.read'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName, userPrincipalName, id, _json } = profile;
    const user = {
      email: userPrincipalName,
      name: displayName,
      accessToken,
      id, // Adding user ID
      // Add more fields as needed
      jobTitle: _json.jobTitle, // Example of adding job title if available
      mobilePhone: _json.mobilePhone, // Mobile phone if available
      avatar: _json.avatar, // Assuming avatar is available in _json
    };

    done(null, user);
  }
}
