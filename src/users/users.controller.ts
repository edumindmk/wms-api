import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserEmployeeDto } from './dto/create-user-employee.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import type { AuthenticatedRequest } from 'src/common/types/auth-request.type';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Req() req: AuthenticatedRequest, @Body() createUserDto: CreateUserEmployeeDto) {

    return this.usersService.createEmployee(req.user.companyId, createUserDto);
  }

  @Get('me')
  @Roles(Role.ADMIN, Role.USER)
  getMe(@Req() req: AuthenticatedRequest) {
    return this.usersService.findOne(req.user.userId);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll(@Req() req: AuthenticatedRequest) {
    return this.usersService.findAll(req.user.companyId);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.usersService.remove(id);
  }
}
