import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from '../dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { getPaginatedData } from '../../Util/pagination.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  // tạo user và profile có xác thực email
  async createUser(createUserDto: CreateUserDto) {
    // Kiểm tra xem user đã tồn tại hay chưa
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new Error('Người dùng đã tồn tại.');
    }
    // Tạo user với isActive: false
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        isActive: false,
        profile: {
          create: {
            name: createUserDto.name,
            jobTitle: createUserDto.jobTitle,
          },
        },
      },
    });

    // Tạo token để đặt pass
    const token = this.jwtService.sign(
      { userId: user.id },
      { secret: process.env.JWT_PASSWORD_SECRET, expiresIn: '1h' },
    );

    //assign role to new user when user signup
    // const userRole = await this.prisma.role.findUnique({
    //   where: { name: 'user' },
    // });
    // if (userRole) {
    //   await this.prisma.userRole.create({
    //     data: {
    //       userId: user.id,
    //       roleId: userRole.id,
    //     },
    //   });
    // }

    // Gửi email để đặt pass
    await this.mailerService.sendMail({
      to: createUserDto.email,
      subject: 'Set Up Your Account',
      template: './password-setup',
      context: {
        token,
        frontendUrl: process.env.FRONTEND_URL,
      },
    });

    return { message: 'User created and email sent.' };
  }

  async getAllUsers(query: any) {
    const includeOptions = {
      id: true,
      email: true,
      createdAt: true,
      profile: {
        select: {
          name: true,
          jobTitle: true,
        },
      },
    };

    return await getPaginatedData(this.prisma, query, 'user', includeOptions);
  }

  // lấy user theo id
  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          select: {
            name: true,
            jobTitle: true,
          },
        },
      },
    });
  }
  // cập nhật trạng thái user isActive
  //   async updateUserStatus(id: string, updateUserDto: UpdateUserDto) {
  //     return this.prisma.user.update({
  //       where: { id },
  //       data: updateUserDto,
  //     });
  //   }
}
