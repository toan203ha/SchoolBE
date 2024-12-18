//src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from './auth.module';
import { UserService } from './user/user.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const tokenFromCookie = request?.cookies?.jwt;
          const tokenFromHeader =
            request?.headers?.authorization?.split(' ')[1];
          return tokenFromCookie || tokenFromHeader || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    //console.log('JWT Payload:', payload);
    const { email } = payload;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
