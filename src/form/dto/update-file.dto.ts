import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateFileDto {
  @ApiPropertyOptional({ description: 'The title of the form' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'The form',
    type: 'string',
    format: 'binary',
  })
  file: any;

  content: string;

  @ApiPropertyOptional({ description: 'The type of the form' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiPropertyOptional({ description: 'The status of the form' })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
