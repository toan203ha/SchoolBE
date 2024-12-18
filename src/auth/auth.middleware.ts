import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies['jwt'];
      if (token) {
        const payload = await this.jwtService.verifyAsync(token);
        this.prismaService.setUserId(payload.id);
        req['userId'] = payload.id;
        req['email'] = payload.email;
        req['jobTitle'] = payload.jobTitle;
        req['name'] = payload.name;

      }
    } catch (error) {
      console.error('Auth middleware error:', error);
    }
    next();
  }
}
