import { Module } from '@nestjs/common';
import { SlideService } from './slide.service';
import { SlideController } from './slide.controller';
import { MinioProvider } from '../minio/minio.provider';

@Module({
  controllers: [SlideController],
  providers: [SlideService, MinioProvider],
})
export class SlideModule {}
