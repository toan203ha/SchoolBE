import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Tên danh mục' })
  @IsString({ message: 'Tên danh mục phải là chuỗi ký tự.' })
  name: string;

  @ApiProperty({ description: 'Trạng thái hoạt động của danh mục' })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái hoạt động phải là giá trị boolean.' })
  isActive?: boolean = true;

  @ApiPropertyOptional({ description: 'Id của danh mục cha' })
  @IsOptional()
  @IsString({ message: 'ID của danh mục cha phải là chuỗi ký tự.' })
  parentId?: string;

  @IsOptional()
  @IsArray()
  children?: CreateCategoryDto[]; // Thêm thuộc tính children
}
