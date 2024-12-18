import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaLibService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllMediaLinks() {
    //Slide model
    const slides = await this.prisma.slide.findMany({
      select: {
        image: true,
      },
    });

    //Post model
    const posts = await this.prisma.post.findMany({
      select: {
        image: true,
      },
    });

    //Major model
    const majors = await this.prisma.majorDetail.findMany({
      select: {
        images: true,
      },
    });

    //Combine all
    const mediaLinks = [
      ...slides.map((slide) => slide.image),
      ...posts.map((post) => post.image),
      ...majors.flatMap((major) => major.images),
    ];

    return {
      success: Boolean(mediaLinks),
      data: mediaLinks || 'Không tìm thấy!!!',
    };
  }
}
