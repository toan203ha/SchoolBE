// src/event/dto/create-event.dto.ts
import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEventDto {
  @ApiPropertyOptional({ description: 'The title of the event' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'The description of the event',
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'The startDate of the event' })
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'The endDate of the event',
  })
  @IsOptional()
  endDate?: Date;

  // chọn true false để xem co lặp lại hay không
  @ApiPropertyOptional({ description: 'The recurring of the event' })
  @IsOptional()
  recurring?: boolean = true;

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
