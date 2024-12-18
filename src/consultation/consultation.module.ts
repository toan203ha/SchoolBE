import { Module } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { ConsultationController } from './consultation.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [ConsultationController],
  providers: [ConsultationService, PrismaClient],
})
export class ConsultationModule {}
