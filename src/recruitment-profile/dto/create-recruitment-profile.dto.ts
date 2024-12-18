// src/dto/create-recruitment-profile.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecruitmentProfileDto {
  @ApiProperty({ description: 'Tên của ứng viên' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Email của ứng viên' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Số điện thoại của ứng viên' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ description: 'Tin nhắn hoặc ghi chú từ ứng viên' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    description: 'Mô tả chi tiết hồ sơ hoặc kinh nghiệm của ứng viên',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Tệp CV của ứng viên (định dạng file)',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  cv?: any;
}
