import { Injectable } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LanguageService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createLanguageDto: CreateLanguageDto) {
    const language = await this.prisma.language.create({
      data: createLanguageDto,
    });
    return {
      success: Boolean(language),
      data: language || 'Không tạo được ngôn ngữ!!!',
    };
  }

  async findAll() {
    const languages = await this.prisma.language.findMany();
    return {
      success: Boolean(languages),
      data: languages || 'Không tìm thấy ngôn ngữ!!!',
    };
  }

  async findOne(id: string) {
    const language = await this.prisma.language.findUnique({
      where: {
        id,
      },
    });
    return {
      success: Boolean(language),
      data: language || 'Không tìm thấy ngôn ngữ!!!',
    };
  }

  async update(id: string, updateLanguageDto: UpdateLanguageDto) {
    const language = await this.prisma.language.update({
      where: {
        id,
      },
      data: updateLanguageDto,
    });
    return {
      success: Boolean(language),
      data: language || 'Không cập nhật được ngôn ngữ!!!',
    };
  }

  async remove(id: string) {
    if (!id) {
      return {
        success: false,
        data: 'Không tìm thấy ngôn ngữ!!!',
      };
    }
    const language = await this.prisma.language.delete({
      where: {
        id,
      },
    });
    return {
      success: Boolean(language),
      data: language || 'Không xóa được ngôn ngữ!!!',
    };
  }
}
