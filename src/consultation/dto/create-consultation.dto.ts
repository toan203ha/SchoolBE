import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class CreateConsultationDto {
  @ApiProperty({ description: 'Tên của ứng viên' })
  @IsNotEmpty({ message: 'Vui lòng nhập tên.' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email của ứng viên' })
  @IsNotEmpty({ message: 'Vui lòng nhập email.' })
  @IsEmail({}, { message: 'Định dạng email không đúng.' })
  email: string;

  @ApiProperty({ description: 'Số điện thoại của ứng viên' })
  @IsNotEmpty({ message: 'Vui lòng nhập số điện thoại.' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng.' })
  phoneNumber: string;
}
