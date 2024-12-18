import { Module } from '@nestjs/common';
import { SubscriberController } from './subscriber.controller';
import { SubscriberService } from './subscriber.service';
import { EmailService } from '../auth/sendemail.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SubscriberController],
  providers: [SubscriberService, EmailService, JwtService],
})
export class SubscribeModule  {

}