import { IsNotEmpty, IsString } from 'class-validator';

export class AssignRoleDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  roleName: string;
}
