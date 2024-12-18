import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';  
import { GoogleStrategy } from './google.strategy'; 

import { ConfigModule } from '@nestjs/config';
import { OtpService } from './otp.service'; 
@Module({
  imports: [ConfigModule], 
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy,OtpService],
})
export class AuthModule {}
