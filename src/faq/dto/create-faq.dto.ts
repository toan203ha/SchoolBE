import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { Status, Problem } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFaqDto {
  @ApiProperty({ description: 'Summary of the question' })
  @IsNotEmpty({ message: 'Summary must not be empty' })
  @IsString({ message: 'Summary must be a string' })
  summary: string;

  @ApiProperty({ description: 'Detailed description of the question' })
  @IsNotEmpty({ message: 'Description must not be empty' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({ description: 'Issue related to the question', enum: Problem })
  @IsNotEmpty({ message: 'Problem must not be empty' })
  @IsEnum(Problem, { message: 'Problem must be a valid value' })
  problem: Problem;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Path to the related file' })
  @IsString({ message: 'File must be a string' })
  file?: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Answer to the question' })
  @IsString({ message: 'Answer must be a string' })
  answer?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Status of the question',
    enum: Status,
    default: Status.PENDING,
  })
  @IsEnum(Status, { message: 'Status must be a valid value' })
  status?: Status;
}
