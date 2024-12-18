import { Module } from '@nestjs/common';
import { MediaLibService } from './media-lib.service';
import { MediaLibController } from './media-lib.controller';

@Module({
  controllers: [MediaLibController],
  providers: [MediaLibService],
})
export class MediaLibModule {}
