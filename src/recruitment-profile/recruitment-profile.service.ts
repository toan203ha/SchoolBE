import { Injectable } from '@nestjs/common';
import { CreateRecruitmentProfileDto } from './dto/create-recruitment-profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import { getPaginatedData } from '../Util/pagination.service';

@Injectable()
export class RecruitmentProfileService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createRecruitmentProfileDto: CreateRecruitmentProfileDto,
    imageUrl: string,
  ) {
    const createProfile = await this.prisma.recruitmentProfile.create({
      data: {
        name: createRecruitmentProfileDto.name,

        email: createRecruitmentProfileDto.email,

        phoneNumber: createRecruitmentProfileDto.phoneNumber,

        message: createRecruitmentProfileDto.message,

        cv: imageUrl,
      },
    });
    return {
      success: Boolean(createProfile),
      data: createProfile ?? 'không nộp được hồ sơ ứng tuyển',
    };
  }

  async findAll(query: any) {
    const includeOptions = {
      id: true,
      name: true,

      email: true,

      phoneNumber: true,

      message: true,

      cv: true,
    };
    return await getPaginatedData(
      this.prisma,
      query,
      'recruitmentProfile',
      includeOptions,
    );
  }

  async findOne(id: string) {
    // Tìm một bản ghi dựa trên id
    const profile = await this.prisma.recruitmentProfile.findUnique({
      where: { id },
    });

    return {
      success: Boolean(profile) ?? 'không tìm thấy ',
      data: profile,
    };
  }

  async remove(id: string) {
    const remove = await this.prisma.recruitmentProfile.delete({
      where: { id },
    });
    return {
      success: Boolean(remove),
      data: remove ?? 'không thể xoá',
    };
  }
}
