import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [RegistrationController],
  providers: [RegistrationService, PrismaClient],
})
export class RegistrationModule {}
