import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ description: 'The full name of the contact' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'The email of the contact' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ description: 'The phone number of the contact' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: 'The message of the contact' })
  @IsNotEmpty()
  @IsString()
  message: string;
}
