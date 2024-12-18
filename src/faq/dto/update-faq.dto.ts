import { IsString, IsEnum, IsOptional } from 'class-validator';
import { Status } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFaqDto {
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
