import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Absence } from './entities/absence.entity';
import { AbsencesListResponseDto } from './dto/absences-list-response.dto';
import type { AuthenticatedRequest } from 'src/common/types/auth-request.type';
import { RolesGuard } from 'src/users/roles.guard';
import { Roles } from 'src/users/roles.decorator';
import { Role } from 'src/users/role.enum';
import { MessageResponseDto } from 'src/common/dto/message-response.dto';

@ApiTags('absences')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('absences')
export class AbsencesController {
  constructor(private readonly absencesService: AbsencesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new absence' })
  @ApiCreatedResponse({ type: Absence })
  @ApiBadRequestResponse({
    description: 'Validation error, invalid date range, failed create, etc.',
  })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  create(@Req() req: AuthenticatedRequest, @Body() createAbsenceDto: CreateAbsenceDto) {
    const userId = createAbsenceDto.userId || req.user.userId;

    return this.absencesService.create(userId, req.user.companyId, createAbsenceDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List all absences' })
  @ApiOkResponse({ type: AbsencesListResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Requires admin role' })
  findAllForCompany(@Req() req: AuthenticatedRequest) {
    return this.absencesService.findAllForCompany(req.user.companyId);
  }

  @Get('user')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'List all absences for user' })
  @ApiOkResponse({ type: AbsencesListResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Requires admin or user role' })
  findAllForUser(@Req() req: AuthenticatedRequest) {
    return this.absencesService.findAllForUser(req.user.userId);
  }

  @Patch('user/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update an absence' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: Absence })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Requires admin role' })
  @ApiBadRequestResponse({ description: 'Absence missing, not pending, or server error (see message)' })
  updateForUser(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Body() updateAbsenceDto: UpdateAbsenceDto) {
    return this.absencesService.updateForUser(req.user.userId, id, updateAbsenceDto);
  }


  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update an absence for company' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: Absence })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Requires admin role' })
  @ApiBadRequestResponse({ description: 'Absence missing or server error (see message)' })
  updateForCompany(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Body() updateAbsenceDto: UpdateAbsenceDto) {
    return this.absencesService.updateForCompany(req.user.companyId, id, updateAbsenceDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete an absence' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Requires admin role' })
  @ApiBadRequestResponse({ description: 'Absence not found or server error (see message)' })
  delete(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.absencesService.delete(req.user.companyId, id);
  }
}
