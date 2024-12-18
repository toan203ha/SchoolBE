import { IsString, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateContactDto {
  @ApiPropertyOptional({ description: 'The full name of the contact' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiPropertyOptional({ description: 'The email of the contact' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiPropertyOptional({ description: 'The phone number of the contact' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiPropertyOptional({ description: 'The message of the contact' })
  @IsNotEmpty()
  @IsString()
  message: string;
}
