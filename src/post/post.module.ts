import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MinioProvider } from '../minio/minio.provider';

@Module({
  controllers: [PostController],
  providers: [PostService, MinioProvider],
})
export class PostModule {}
