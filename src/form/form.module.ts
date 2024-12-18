import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { MinioProvider } from '../minio/minio.provider';

@Module({
  controllers: [FormController],
  providers: [FormService, MinioProvider],
})
export class FormModule {}
