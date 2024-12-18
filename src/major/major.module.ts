import { Module } from '@nestjs/common';
import { MajorService } from './major.service';
import { MajorController } from './major.controller';
import { MinioProvider } from 'src/minio/minio.provider';

@Module({
  controllers: [MajorController],
  providers: [MajorService, MinioProvider],
})
export class MajorModule {}
