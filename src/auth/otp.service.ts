import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as speakeasy from 'speakeasy';

@Injectable()
export class OtpService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  async sendOtp(email: string) {
    const secret = speakeasy.generateSecret({ length: 20 });
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${token}`,
    };

    await this.transporter.sendMail(mailOptions);
    return { message: 'OTP sent to your email' };
  }
}
