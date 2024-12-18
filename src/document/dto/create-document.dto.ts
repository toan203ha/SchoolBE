import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({ description: 'The title of the document' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'The content of the document' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'The type of the document' })
  @IsNotEmpty()
  @IsString()
  type: string;
}
