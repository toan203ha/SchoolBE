import { Controller, Get } from '@nestjs/common';
import { MediaLibService } from './media-lib.service';

@Controller('media')
export class MediaLibController {
  constructor(private readonly mediaLibService: MediaLibService) {}

  @Get()
  async getAllMediaLinks() {
    return this.mediaLibService.getAllMediaLinks();
  }
}
