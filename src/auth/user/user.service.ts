import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SetPasswordDto } from '../dto/set-password.dto';
import { LoginDto } from '../dto/login.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { Response } from 'express';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}
  // Hàm đặt mật khẩu khi tạo mới
  async setPassword(setPasswordDto: SetPasswordDto) {
    try {
      const { userId } = this.jwtService.verify(setPasswordDto.token, {
        secret: process.env.JWT_PASSWORD_SECRET,
      });

      const hashedPassword = await bcrypt.hash(setPasswordDto.password, 10);

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          isActive: true,
        },
      });

      return { message: 'Đặt mật khẩu thành công. Bạn có thể đăng nhập ngay.' };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Mã token không hợp lệ hoặc đã hết hạn.');
    }
  }
  // hàm đăng nhập và tạo token credentials
  async login(loginDto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user || user.isActive === false) {
      return {
        success: false,
        message: 'Tài khoản không tồn tại hoặc không được kích hoạt.',
      };
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      if (!loginDto.twoFactorCode) {
        throw new UnauthorizedException('2FA code required');
      }

      const isTwoFactorValid = await this.verifyTwoFactorCode(
        user,
        loginDto.twoFactorCode,
      );

      console.log(isTwoFactorValid);
      if (!isTwoFactorValid)
        throw new UnauthorizedException('Invalid 2FA code');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('Thông tin đăng nhập không chính xác.');
    }

    const payload = {
      id: user.id,
      email: user.email,
      twoFactorEnabled: false,
    };

    const token = this.jwtService.sign(payload);

    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() +
          Number(process.env.COOKIE_EXPIRES_TIME) * 24 * 60 * 60 * 1000,
      ),
    });

    return {
      success: Boolean(payload),
      result: token ?? 'Không tạo được token!!!',
    };
  }
  // hàm tạo token microsoft

  async tokenMicrosoft(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    console.log('user', user);
    // chưa thêm id
    const payload = { id: user.id, email: email };
    
    console.log('payload', payload);
    const accessToken = this.jwtService.sign(payload);

    return {
      success: Boolean(payload),
      result: accessToken ?? 'Không tạo được token!!!',
    };
  }

  // Hàm tìm user theo email
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  // quên mật khẩu
  async forgotPassword(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      return { message: 'Không tìm thấy tài khoản với email này.' };
    }
    // tạo token
    const token = this.jwtService.sign(
      { userId: user.id },
      { secret: process.env.JWT_PASSWORD_SECRET, expiresIn: '24h' },
    );

    // Gửi email để đặt pass
    await this.mailerService.sendMail({
      to: email,
      subject: 'Đặt lại mật khẩu',
      template: './password-setup',
      context: {
        token,
        frontendUrl: process.env.FRONTEND_URL,
      },
    });

    return {
      message: 'Đã gửi Email xác nhận mật khẩu.',
    };
  }

  async generateTwoFactorSecret(user: any) {
    console.log('user', user.twoFactorEnabled);
    if (user.twoFactorEnabled) {
      return {
        success: false,
        message: '2FA is already enabled for this user',
      };
    }
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, 'school', secret);

    // Store the secret in the database
    await this.prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret },
    });

    const qrCodeDataURL = await toDataURL(otpauthUrl);
    return { twoFactorSecret: secret, qrCodeDataURL };
  }

  async verifyTwoFactorCode(user: any, code: string): Promise<boolean> {
    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });
    return isValid;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return false;
    }
    return bcrypt.compare(password, user.password);
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }
}
