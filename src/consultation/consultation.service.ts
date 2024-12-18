import { Injectable } from '@nestjs/common';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { getPaginatedData } from '../Util/pagination.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConsultationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateConsultationDto) {
    const consultations = await this.prisma.consultation.create({ data });
    return {
      success: Boolean(consultations),
      data: consultations ?? 'không thể đăng ký tư vấn tuyển sinh',
    };
  }
  //Lây hết tất cả sản phẩm
  async findAll(query: any) {
    const includeOptions = {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      status: true,
    };
    return await getPaginatedData(
      this.prisma,
      query,
      'consultation',
      includeOptions,
    );
  }

  async findOne(id: string) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      return {
        success: false,
        data: 'Không tìm thấy lịch tư vấn tuyển sinh',
      };
    }

    return {
      success: true,
      data: consultation,
    };
  }

  async update(id: string, data: UpdateConsultationDto) {
    const consultations = await this.prisma.consultation.update({
      where: { id },
      data,
    });

    return {
      success: Boolean(consultations),
      data: consultations ?? 'không cập nhật thành công',
    };
  }

  async remove(id: string) {
    const consultations = await this.prisma.consultation.delete({
      where: { id },
    });
    return {
      success: Boolean(consultations),
      data: consultations ?? 'không xoá thành công',
    };
  }
}
