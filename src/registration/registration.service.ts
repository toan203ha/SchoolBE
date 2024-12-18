import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { getPaginatedData } from 'src/Util/pagination.service';

@Injectable()
export class RegistrationService {
  constructor(private readonly prisma: PrismaService) {}

  // Tạo đơn đăng ký
  async create(createRegistrationDto: CreateRegistrationDto) {
    return await this.prisma.registration.create({
      data: {
        major1: createRegistrationDto.major1,
        major2: createRegistrationDto.major2,
        student: {
          create: [
            {
              name: createRegistrationDto.name,
              email: createRegistrationDto.email,
              phoneNumber: createRegistrationDto.phoneNumber,
              CCCD: createRegistrationDto.CCCD,
              gender: createRegistrationDto.gender,
              graduationYear: createRegistrationDto.graduationYear,
              highSchoolProvince: createRegistrationDto.highSchoolProvince,
              highSchoolName: createRegistrationDto.highSchoolName,
            },
          ],
        },
      },
      include: { student: true },
    });
  }

  async findAll(query: any) {
    const includeOptions = {
      major1: true,
      major2: true,
      status: true,
      dateApplied: true,
      student: true,
    };
    return await getPaginatedData(
      this.prisma,
      query,
      'registration',
      includeOptions,
    );
  }

  // Lấy chi tiết đơn đăng ký theo id và bao gồm cả thông tin Student
  async getRegistrationDetails(id: string) {
    const registration = await this.prisma.registration.findUnique({
      where: { id: id },
      include: { student: true },
    });

    if (!registration) {
      throw new BadRequestException('Đơn đăng ký không tồn tại.');
    }

    return registration;
  }

  // Xóa đơn đăng ký
  async deleteRegistration(id: string) {
    // Tìm các student liên quan đến registration
    const registration = await this.prisma.registration.findUnique({
      where: { id: id },
      include: { student: true },
    });

    if (!registration) {
      throw new BadRequestException('Đơn đăng ký không tồn tại.');
    }

    // Xóa các student liên quan
    if (registration?.student.length > 0) {
      await this.prisma.student.deleteMany({
        where: {
          registrationId: id,
        },
      });
    }

    // Sau đó xóa registration
    await this.prisma.registration.delete({
      where: { id: id },
    });

    return { message: 'Đã xóa thành công!' };
  }
}
