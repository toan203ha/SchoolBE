import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { Permissions } from '../decorators/permissions.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Permissions('manage_roles')
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @Permissions('view_roles')
  async findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @Permissions('view_roles')
  async findOne(@Param('id') id: string) {
    const role = await this.roleService.findOne(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  @Post(':id/permissions')
  @Permissions('manage_roles')
  async assignPermissions(
    @Param('id') id: string,
    @Body() permissionIds: string[],
  ) {
    return this.roleService.assignPermissions(id, permissionIds);
  }

  @Post(':roleId/users/:userId')
  @Permissions('manage_roles')
  async assignRoleToUser(
    @Param('roleId') roleId: string,
    @Param('userId') userId: string,
  ) {
    return this.roleService.assignRoleToUser(userId, roleId);
  }
}
