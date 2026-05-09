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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { CreateEmployeeResponseDto } from './dto/create-employee-response.dto';
import { UsersListResponseDto } from './dto/users-list-response.dto';
import { MessageResponseDto } from 'src/common/dto/message-response.dto';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create an employee in your company' })
  @ApiCreatedResponse({ type: CreateEmployeeResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Requires admin role' })
  @ApiBadRequestResponse({ description: 'Validation error or duplicate email' })
  create(@Req() req: AuthenticatedRequest, @Body() createUserDto: CreateUserEmployeeDto) {
    return this.usersService.createEmployee(req.user.companyId, createUserDto);
  }

  @Get('me')
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Current user profile' })
  @ApiOkResponse({ type: User })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  getMe(@Req() req: AuthenticatedRequest) {
    return this.usersService.findOne(req.user.userId);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List users in your company' })
  @ApiOkResponse({ type: UsersListResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Requires admin role' })
  findAll(@Req() req: AuthenticatedRequest) {
    return this.usersService.findAll(req.user.companyId);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: User })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Requires admin role' })
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: User })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Requires admin role' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Requires admin role' })
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.usersService.remove(id);
  }
}
