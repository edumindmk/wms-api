import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { WorkSessionsService } from './work-sessions.service';
import { CreateWorkSessionDto } from './dto/create-work-session.dto';
import { UpdateWorkSessionDto } from './dto/update-work-session.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import type { AuthenticatedRequest } from 'src/common/types/auth-request.type';

@UseGuards(JwtAuthGuard)
@Controller('work-sessions')
export class WorkSessionsController {
  constructor(private readonly workSessionsService: WorkSessionsService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() createWorkSessionDto: CreateWorkSessionDto) {
    return this.workSessionsService.create(req.user.userId, req.user.companyId, createWorkSessionDto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.workSessionsService.findAll(req.user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.workSessionsService.findOne(id, req.user.companyId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Body() updateWorkSessionDto: UpdateWorkSessionDto) {
    return this.workSessionsService.update(id, req.user.companyId, updateWorkSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.workSessionsService.remove(id, req.user.companyId);
  }
}
