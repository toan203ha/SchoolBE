import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSlideDto {
  @ApiPropertyOptional({ description: 'The post ID' })
  @IsOptional()
  @IsString()
  postId?: string;

  @ApiPropertyOptional({ description: 'The title of the slide' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'The alternative name of the slide' })
  @IsOptional()
  @IsString()
  altName?: string;

  @ApiPropertyOptional({ description: 'The description of the slide' })
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
