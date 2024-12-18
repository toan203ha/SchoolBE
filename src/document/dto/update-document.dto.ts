import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDocumentDto {
  @ApiPropertyOptional({ description: 'The title of the document' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'The content of the document' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'The type of the document' })
  @IsOptional()
  @IsString()
  type?: string;
}
