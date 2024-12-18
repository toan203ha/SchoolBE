import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsArray,
  ArrayNotEmpty,
  IsInt,
  Min,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';

export class UpdateMajorDto {
  @ApiPropertyOptional({ description: 'Tên danh mục' })
  @IsString({ message: 'Tên ngành phải là chuỗi' })
  @IsOptional()
  @MaxLength(100, { message: 'Tên ngành không được quá 100 ký tự' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Hình ảnh của ngành (URL hoặc file)',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ description: 'Khái quát về ngành' })
  @IsString({ message: 'Mô tả phải là chuỗi' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Thế mạnh đào tạo ngành' })
  @IsString({ message: 'Thế mạnh đào tạo phải là chuỗi' })
  @IsOptional()
  trainingStrengths?: string;

  @ApiPropertyOptional({ description: 'Cơ hội học tập nâng cao' })
  @IsString({ message: 'Cơ hội học tập phải là chuỗi' })
  @IsOptional()
  advancedStudyOpportunities?: string;

  @ApiPropertyOptional({ description: 'Cơ hội việc làm' })
  @IsString({ message: 'Cơ hội việc làm phải là chuỗi' })
  @IsOptional()
  jobOpportunities?: string;

  @ApiPropertyOptional({
    description: 'Mảng hình ảnh của ngành (file binary)',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  @IsOptional()
  @IsArray({ message: 'Dữ liệu phải là mảng' })
  @ArrayNotEmpty({ message: 'Mảng hình ảnh không được để trống' })
  //@Column('simple-array')
  // images?: Express.Multer.File[];
  images?: string[];
  @ApiPropertyOptional({
    description:
      'Mảng vị trí hình ảnh cần cập nhật. Chỉ định chỉ mục các hình ảnh trong mảng cũ.',
    type: 'array',
    items: { type: 'number' },
  })
  @IsOptional()
  //@IsArray({ message: 'Dữ liệu phải là mảng' })
  //@ArrayNotEmpty({ message: 'Danh sách vị trí hình ảnh không được để trống' })
  //@IsInt({ each: true, message: 'Các vị trí phải là số nguyên' })
  //@Min(0, { each: true, message: 'Vị trí hình ảnh không hợp lệ' })
  imageIndices?: string | number;
}
