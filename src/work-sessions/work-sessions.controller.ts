import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseUUIDPipe } from '@nestjs/common';
import { WorkSessionsService } from './work-sessions.service';
import { CreateWorkSessionDto } from './dto/create-work-session.dto';
import { UpdateWorkSessionDto } from './dto/update-work-session.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import type { AuthenticatedRequest } from 'src/common/types/auth-request.type';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { WorkSession } from './entities/work-session.entity';
import { MessageResponseDto } from 'src/common/dto/message-response.dto';

@ApiTags('work-sessions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('work-sessions')
export class WorkSessionsController {
  constructor(private readonly workSessionsService: WorkSessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a work session for the current user' })
  @ApiCreatedResponse({ type: WorkSession })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse({ description: 'Invalid dates, overlap, or validation error' })
  create(@Req() req: AuthenticatedRequest, @Body() createWorkSessionDto: CreateWorkSessionDto) {
    return this.workSessionsService.create(req.user.userId, req.user.companyId, createWorkSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'List work sessions for your company' })
  @ApiOkResponse({ type: [WorkSession] })
  @ApiUnauthorizedResponse()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.workSessionsService.findAll(req.user.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one work session' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: WorkSession })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse({ description: 'Work session not found' })
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Req() req: AuthenticatedRequest) {
    return this.workSessionsService.findOne(id, req.user.companyId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a work session' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: WorkSession })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse({ description: 'Work session not found' })
  @ApiBadRequestResponse({ description: 'Invalid dates or overlapping session' })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Req() req: AuthenticatedRequest,
    @Body() updateWorkSessionDto: UpdateWorkSessionDto,
  ) {
    return this.workSessionsService.update(id, req.user.companyId, updateWorkSessionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a work session' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse({ description: 'Work session not found' })
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Req() req: AuthenticatedRequest) {
    return this.workSessionsService.remove(id, req.user.companyId);
  }
}
