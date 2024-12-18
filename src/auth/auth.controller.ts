import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Chức năng này sẽ chuyển hướng đến Google để xác thực
  }
  // hàm trả về dữ liêu
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    // Sau khi Google xác thực, thông tin user sẽ trả về qua req.user
    return req.user; // Trả về thông tin người dùng
  }

  // đăng nhập bằng github
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req) {
    // Chức năng này sẽ chuyển hướng đến Github để xác thực
  }
  // hàm callback github
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubAuthRedirect(@Req() req) {
    // Sau khi Github xác thực, thông tin user sẽ trả về qua req.user
    return req.user;  
  }
}




// import { Controller, Get, Req, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { OtpService } from './otp.service'; // Nhớ import OtpService

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly otpService: OtpService) {}

//   @Get('google')
//   @UseGuards(AuthGuard('google'))
//   async googleAuth(@Req() req) {
//     // Chức năng này sẽ chuyển hướng đến Google để xác thực
//   }

//   @Get('google/callback')
//   @UseGuards(AuthGuard('google'))
//   async googleAuthRedirect(@Req() req) {
//     // Sau khi Google xác thực, thông tin user sẽ trả về qua req.user
//     const user = req.user;
    
//     // Gửi mã OTP đến email của người dùng
//     await this.otpService.sendOtp(user.email);

//     return { message: 'OTP has been sent to your email', user };
//   }
// }
