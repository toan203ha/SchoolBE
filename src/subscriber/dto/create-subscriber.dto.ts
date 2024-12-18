import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriberDto {
  @ApiProperty({ description: 'User ID for the subscription' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Event ID for the subscription' })
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({ description: 'Email of the subscriber' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
