import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../dto/create-user.dto';
import { IsBoolean } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsBoolean()
  isActive: boolean;
}
