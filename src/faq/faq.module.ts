import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { MinioProvider } from 'src/minio/minio.provider';

@Module({
  controllers: [FaqController],
  providers: [FaqService, MinioProvider],
})
export class FaqModule {}
