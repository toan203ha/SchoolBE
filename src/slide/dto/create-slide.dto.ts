import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSlideDto {
  @ApiProperty({ description: 'The post ID' })
  @IsNotEmpty()
  @IsString()
  postId: string;

  @ApiProperty({ description: 'The title of the slide' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'The alternative name of the slide' })
  @IsOptional()
  @IsString()
  altName: string;

  @ApiPropertyOptional({ description: 'The description of the slide' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'The image file to upload',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  image?: any;
}
