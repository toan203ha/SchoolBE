import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistrationDto } from './create-registration.dto';
import { Status } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsNotEmpty,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateRegistrationDto extends PartialType(CreateRegistrationDto) {
  @IsString({
    message: 'Ngành chính (major1) phải là chuỗi ký tự.',
  })
  @IsNotEmpty({
    message: 'Ngành chính (major1) không được để trống.',
  })
  major1: string;

  @IsString({
    message: 'Ngành phụ (major2) phải là chuỗi ký tự.',
  })
  @IsOptional()
  major2?: string;

  @IsEnum(Status, {
    message:
      'Trạng thái (status) không hợp lệ, chỉ chấp nhận các giá trị: PENDING, APPROVED, REJECTED.',
  })
  @IsOptional()
  status?: Status;

  @IsDate({
    message: 'Ngày nộp đơn (dateApplied) phải là định dạng ngày tháng.',
  })
  @Type(() => Date)
  @Transform(() => new Date(), { toClassOnly: true })
  @IsOptional()
  dateApplied?: Date = new Date();
}
