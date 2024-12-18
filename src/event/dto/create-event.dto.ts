// src/event/dto/create-event.dto.ts
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export enum EventTags {
  GV = 'Giáo viên',
  SV = 'Sinh viên',
}
export class CreateEventDto {
  @ApiProperty({ description: 'The title of the event' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The description of the event' })
  @IsNotEmpty()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'The startDate of the event' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'The endDate of the event' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  // chọn true false để xem co lặp lại hay không
  @ApiProperty({ description: 'The recurring of the event' })
  @IsBoolean()
  recurring: boolean;


  @ApiProperty({
    description: 'The tags of the event',
    enum: EventTags, 
  })
  @IsEnum(EventTags, { message: 'tags must be a valid EventTags value' }) 
  tags: EventTags;


  @IsOptional()
  validateDates() {
    const currentDate = new Date();

    if (this.startDate < currentDate) {
      throw new Error(
        'startDate must be equal to or greater than the current date',
      );
    }

    if (this.startDate >= this.endDate) {
      throw new Error('startDate must be earlier than endDate');
    }
  }
}



