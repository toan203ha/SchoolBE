import {
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  IsInt,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class CreateStudentDto {
  @ApiProperty({
    description: 'The student’s full name, cannot contain special characters.',
  })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @Matches(/^[\p{L}\s]+$/u, {
    message: 'Name cannot contain special characters',
  })
  name: string;

  @ApiProperty({
    description: 'The student’s email address, must be a valid email format.',
  })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description:
      'The student’s phone number, must be 10 digits starting with valid Vietnam prefixes (03, 05, 07, 08, 09).',
  })
  @IsNotEmpty({ message: 'Phone number cannot be empty' })
  @Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
  @Matches(/^(03|05|07|08|09)[0-9]{8}$/, {
    message:
      'Phone number must start with valid Vietnam prefixes (03, 05, 07, 08, 09) and contain 10 digits',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'The student’s CCCD, must contain 9 to 12 digits only.',
  })
  @IsNotEmpty({ message: 'CCCD cannot be empty' })
  @Length(9, 12, { message: 'CCCD must be 9 to 12 digits long' })
  @Matches(/^[0-9]+$/, { message: 'CCCD must contain only digits' })
  CCCD: string;

  @ApiProperty({
    description: 'The student’s gender, must be one of: MALE, FEMALE, OTHER.',
  })
  @IsNotEmpty({ message: 'Gender cannot be empty' })
  @IsEnum(Gender, {
    message: 'Gender must be one of: MALE, FEMALE, OTHER',
  })
  gender: Gender;

  @ApiProperty({
    description:
      'The year the student graduated, must be a valid year between 1900 and the current year.',
  })
  @IsNotEmpty({ message: 'Graduation year cannot be empty' })
  @IsInt({ message: 'Graduation year must be an integer' })
  @Min(1900, { message: 'Invalid graduation year' })
  @Max(new Date().getFullYear(), {
    message: `Graduation year cannot be later than ${new Date().getFullYear()}`,
  })
  graduationYear: number;

  @ApiProperty({
    description:
      'The province where the student graduated high school, cannot be empty.',
  })
  @IsNotEmpty({ message: 'Graduation province cannot be empty' })
  highSchoolProvince: string;

  @ApiProperty({
    description:
      'The name of the high school the student attended, cannot be empty.',
  })
  @IsNotEmpty({ message: 'High school name cannot be empty' })
  highSchoolName: string;
}
