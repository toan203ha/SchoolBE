import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadFileDto {
  content: string;

  @ApiProperty({ description: 'The title of the form' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'The type of the form' })
  @IsOptional()
  type: string;

  @ApiPropertyOptional({ description: 'The status of the form' })
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({ description: 'The form', type: 'string', format: 'binary' })
  file: any;
}
