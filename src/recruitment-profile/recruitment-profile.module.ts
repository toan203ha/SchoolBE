import { Module } from '@nestjs/common';
import { RecruitmentProfileService } from './recruitment-profile.service';
import { RecruitmentProfileController } from './recruitment-profile.controller';
import { MinioProvider } from '../minio/minio.provider';

@Module({
  controllers: [RecruitmentProfileController],
  providers: [RecruitmentProfileService, MinioProvider],
})
export class RecruitmentProfileModule {}
