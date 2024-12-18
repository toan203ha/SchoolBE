import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { promises as fs } from 'fs';
import * as speakeasy from 'speakeasy';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { join } from 'path';
import juice from 'juice';

@Injectable()
export class EmailService {
  private readonly transporter;
  private readonly otpStore = new Map<string, string>();
  private readonly otpExpiry: Map<string, Date> = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const email = configService.get<string>('GMAIL_USER');
    const password = configService.get<string>('GMAIL_PASS');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    });
  }

  // Hàm gửi OTP
  async sendOtp(email: string) {
    const secret = speakeasy.generateSecret({ length: 20 });
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
      step: 300, // thời gian của mã OTP
    });
    // Lưu mã OTP vào otpStore
    this.otpStore.set(email, token);
    this.otpExpiry.set(email, new Date(Date.now() + 300000));

    const mailOptions = {
      from: this.configService.get<string>('GMAIL_USER'),
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${token}`,
    };
    await this.transporter.sendMail(mailOptions);
    return { message: 'OTP sent to your email' };
  }

  private async compileTemplate(filePath: string, data: any): Promise<string> {
    const templateContent = await fs.readFile(filePath, 'utf8');
    const template = handlebars.compile(templateContent);
    const html = template(data);
    return juice(html); // Chuyển đổi CSS thành inline
  }

  async sendemail(email: string, idevent: string) {
    const eventinfo = await this.prisma.event.findUnique({
      where: { id: idevent },
    });

    const templatePath = join(
           
      'templates',
      'emailsubcribe.hbs',
    );
    const htmlContent = await this.compileTemplate(templatePath, {
      title: eventinfo.title,
      description: eventinfo.description,
      startDate: eventinfo.startDate.toLocaleString(),
      endDate: eventinfo.endDate.toLocaleString(),
      recurring: eventinfo.recurring ? 'Yes' : 'No',
    });

    const mailOptions = {
      from: this.configService.get<string>('GMAIL_USER'),
      to: email,
      subject: `Information about Event: ${eventinfo.title}`,
      html: htmlContent,
    };

    await this.transporter.sendMail(mailOptions);
    return { message: 'Event information sent to your email' };
  }

  // Hàm xác minh OTP
  async verifyOtp(email: string, otp: string) {
    const storedOtp = this.otpStore.get(email);
    const expiryTime = this.otpExpiry.get(email);

    if (expiryTime && new Date() > expiryTime) {
      return { message: 'Expire OTP' };
    }
    if (!storedOtp) {
      return { message: 'No OTP found for this email' };
    }

    if (storedOtp === otp) {
      this.otpStore.delete(email);
      return { message: 'OTP is valid' };
    } else {
      return { message: 'Invalid OTP' };
    }
  }

  // Hàm để kiểm tra và tạo người dùng mới cùng với profile
  async createUserIfNotExists(user: any) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      // Tạo người dùng mới và profile
      const newUser = await this.prisma.user.create({
        data: {
          email: user.email,
          isActive: true,
          profile: {
            create: {
              name: user.name || 'name',
              jobTitle: user.jobTitle ?? '',
            },
          },
        },
      });
      return newUser;
    }
    console.log('existingUser', existingUser);
    return existingUser;
  }
}
