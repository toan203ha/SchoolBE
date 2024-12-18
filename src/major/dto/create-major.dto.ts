import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateMajorDto {
  @ApiProperty({ description: 'Tên danh mục' })
  @IsString({ message: 'Tên ngành phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên ngành không được để trống' })
  @MaxLength(100, { message: 'Tên ngành không được quá 100 ký tự' })
  name: string;

  @ApiProperty({
    description: 'Hình ảnh của ngành (URL hoặc file)',
    type: 'string',
    format: 'binary',
  })
  image?: string;

  @ApiProperty({ description: 'Khái quát về ngành' })
  @IsString({ message: 'Mô tả phải là chuỗi' })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty({ description: 'Thế mạnh đào tạo ngành' })
  @IsString({ message: 'Thế mạnh đào tạo phải là chuỗi' })
  @IsNotEmpty({ message: 'Thế mạnh đào tạo không được để trống' })
  trainingStrengths: string;

  @ApiProperty({ description: 'Cơ hội học tập nâng cao' })
  @IsString({ message: 'Cơ hội học tập phải là chuỗi' })
  @IsNotEmpty({ message: 'Cơ hội học tập không được để trống' })
  advancedStudyOpportunities: string;

  @ApiProperty({ description: 'Cơ hội việc làm' })
  @IsString({ message: 'Cơ hội việc làm phải là chuỗi' })
  @IsNotEmpty({ message: 'Cơ hội việc làm không được để trống' })
  jobOpportunities: string;

  @ApiPropertyOptional({
    description: 'Mảng hình ảnh của ngành (file binary)',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  @IsOptional()
  images?: Express.Multer.File[];
}
