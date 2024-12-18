import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The jobTitle of the user' })
  @IsNotEmpty()
  jobTitle: string;
}
