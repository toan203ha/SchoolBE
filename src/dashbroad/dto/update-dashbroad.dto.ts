import { PartialType } from '@nestjs/mapped-types';
import { CreateDashbroadDto } from './create-dashbroad.dto';

export class UpdateDashbroadDto extends PartialType(CreateDashbroadDto) {}
