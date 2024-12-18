import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ description: 'Tên danh mục' })
  @IsOptional()
  @IsString({ message: 'Tên danh mục phải là chuỗi ký tự.' })
  name: string;

  @ApiPropertyOptional({ description: 'Trạng thái hoạt động của danh mục' })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái hoạt động phải là giá trị boolean.' })
  isActive?: boolean = true;

  @ApiPropertyOptional({ description: 'Id của danh mục cha' })
  @IsOptional()
  @IsString({ message: 'ID của danh mục cha phải là chuỗi ký tự.' })
  parentId?: string;
}
