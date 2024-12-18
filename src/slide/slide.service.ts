import { getPaginatedData } from '../Util/pagination.service';
import { Injectable } from '@nestjs/common';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SlideService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSlideDto: CreateSlideDto, imageUrl: string) {
    return this.prisma.slide.create({
      data: {
        ...createSlideDto,
        image: imageUrl,
      },
      select: {
        id: true,
        title: true,
        image: true,
      },
    });
  }

  async findAll(query: any) {
    const includeOption = {
      id: true,
      title: true,
      image: true,
      createdAt: true,
      post: {
        select: {
          title: true,
          image: true,
        },
      },
    };
    return await getPaginatedData(this.prisma, query, 'slide', includeOption);
  }

  async findOne(id: string) {
    const slide = await this.prisma.slide.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        image: true,
        createdAt: true,
        post: {
          select: {
            id: true,
            title: true,
            image: true,
            content: true,
          },
        },
      },
    });
    return {
      success: Boolean(slide),
      data: slide ?? 'Không tìm thấy slide',
    };
  }

  async update(id: string, updateSlideDto: UpdateSlideDto, imageUrl?: string) {
    const dataToUpdate = {
      ...updateSlideDto,
      ...(imageUrl && { image: imageUrl }),
    };

    return this.prisma.slide.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: string) {
    return this.prisma.slide.delete({
      where: { id },
    });
  }
}
