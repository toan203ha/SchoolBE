import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Permissions } from '../decorators/permissions.decorator';
import { RolesGuard } from '../guard/roles.guard';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
// import { CreateUserDto } from './dto/create-user.dto';
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Permissions('manage_users')
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Permissions('view_users')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  //   @Post()
  //   create(@Body() createUserDto: CreateUserDto) {
  //     return this.userService.create(createUserDto);
  //   }

  //   @Get()
  //   findAll() {
  //     return this.userService.findAll();
  //   }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.userService.findOne(+id);
  //   }

  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //     return this.userService.update(+id, updateUserDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.userService.remove(+id);
  //   }
}
