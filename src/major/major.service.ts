import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MajorService {
  removeWithDetails(id: string) {
    throw new Error('Method not implemented.');
  }
  findOneWithDetails(id: string) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly prisma: PrismaService) {}

  // Tạo một ngành học mới cùng với MajorDetail
  async create(
    createMajorDto: CreateMajorDto,
    image: string,
    imageUrls: string[],
  ) {
    const createMajor = await this.prisma.major.create({
      data: {
        name: createMajorDto.name,
        image: image, // Use the first image in the array if available
        details: {
          create: {
            description: createMajorDto.description,
            trainingStrengths: createMajorDto.trainingStrengths,
            advancedStudyOpportunities:
              createMajorDto.advancedStudyOpportunities,
            jobOpportunities: createMajorDto.jobOpportunities,
            images: imageUrls, // Store the array of images
          },
        },
      },
      include: { details: true }, // Include the MajorDetail in the response
    });

    return {
      success: Boolean(createMajor),
      data: createMajor || 'Không thể tạo ngành học',
    };
  }

  // Cập nhật ngành học và MajorDetail
  // Cập nhật ngành học và MajorDetail
  async update(
    id: string,
    updateMajorDto: UpdateMajorDto,
    imageUrl?: string,
    imageUrls?: string[],
  ) {
    const major = await this.prisma.major.findUnique({
      where: { id: id },
      include: { details: true },
    });

    if (!major) {
      throw new NotFoundException('Ngành học không tồn tại');
    }

    let currentImages = major.details?.images || [];

    // Cập nhật hoặc thêm hình ảnh
    if (imageUrls && imageUrls.length > 0) {
      const imageIndex = parseInt(updateMajorDto.imageIndices as string, 10);

      // Kiểm tra nếu chỉ mục là số âm
      if (!isNaN(imageIndex) && imageIndex < 0) {
        throw new BadRequestException('Chỉ mục hình ảnh không được là số âm');
      }

      // Nếu chỉ mục hợp lệ, cập nhật hình ảnh tại vị trí đó
      if (
        !isNaN(imageIndex) &&
        imageIndex >= 0 &&
        imageIndex < currentImages.length
      ) {
        currentImages[imageIndex] = imageUrls[0]; // Cập nhật hình ảnh tại vị trí chỉ định
      } else {
        // Nếu chỉ mục không hợp lệ (quá giới hạn của mảng), thêm ảnh mới vào cuối mảng
        currentImages.push(imageUrls[0]);
      }
    }

    const updatedMajor = await this.prisma.major.update({
      where: { id: id },
      data: {
        name: updateMajorDto.name || major.name,
        image: imageUrl || major.image,
        details: {
          update: {
            description:
              updateMajorDto.description || major.details?.description,
            trainingStrengths:
              updateMajorDto.trainingStrengths ||
              major.details?.trainingStrengths,
            advancedStudyOpportunities:
              updateMajorDto.advancedStudyOpportunities ||
              major.details?.advancedStudyOpportunities,
            jobOpportunities:
              updateMajorDto.jobOpportunities ||
              major.details?.jobOpportunities,
            images: currentImages, // Cập nhật lại mảng hình ảnh
          },
        },
      },
      include: { details: true },
    });

    return {
      success: Boolean(updatedMajor),
      data: updatedMajor || 'Không thể cập nhật ngành học',
    };
  }

  // Xóa ngành học cùng với MajorDetail
  async remove(id: string) {
    const removedMajor = await this.prisma.major.delete({
      where: { id: id },
      include: { details: true }, // Bao gồm luôn MajorDetail để xóa
    });

    return {
      success: Boolean(removedMajor),
      data: removedMajor || 'Không thể xóa ngành học',
    };
  }

  // Lấy danh sách ngành học với chi tiết
  async findAll(query: any) {
    const majors = await this.prisma.major.findMany({
      include: { details: true }, // Bao gồm MajorDetail
    });
    return {
      success: true,
      data: majors,
    };
  }

  // Tìm một ngành học theo ID
  async findOne(id: string) {
    const major = await this.prisma.major.findUnique({
      where: { id },
      include: { details: true },
    });

    if (!major) {
      throw new NotFoundException('Không tìm thấy ngành học');
    }

    return {
      success: true,
      data: major,
    };
  }
}
