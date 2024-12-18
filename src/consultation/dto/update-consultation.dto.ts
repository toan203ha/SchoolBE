import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { CreateConsultationDto } from './create-consultation.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateConsultationDto extends PartialType(CreateConsultationDto) {
  @ApiPropertyOptional({ description: 'Tên của ứng viên' })
  @IsOptional()
  @IsString({ message: 'Tên phải là chuỗi ký tự.' })
  name?: string;

  @ApiPropertyOptional({ description: 'Email của ứng viên' })
  @IsOptional()
  @IsEmail({}, { message: 'Định dạng email không đúng.' })
  email?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại của ứng viên' })
  @IsOptional()
  @IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng.' })
  phoneNumber?: string;
}
