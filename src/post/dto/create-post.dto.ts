import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'The title of the post' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The content of the post' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'The category ID of the post' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ description: 'The language ID of the post' })
  @IsString()
  @IsNotEmpty()
  languageId?: string;

  @ApiPropertyOptional({ description: 'The description of the post' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'The image file to upload',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  image?: any;
}
