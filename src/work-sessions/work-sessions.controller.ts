import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { WorkSessionsService } from './work-sessions.service';
import { CreateWorkSessionDto } from './dto/create-work-session.dto';
import { UpdateWorkSessionDto } from './dto/update-work-session.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

type AuthenticatedRequest = Request & {
  user: { userId: string; email: string };
};

@UseGuards(JwtAuthGuard)
@Controller('work-sessions')
export class WorkSessionsController {
  constructor(private readonly workSessionsService: WorkSessionsService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() createWorkSessionDto: CreateWorkSessionDto) {
    return this.workSessionsService.create(req.user.userId, createWorkSessionDto);
  }

  @Get()
  findAll() {
    return this.workSessionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workSessionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkSessionDto: UpdateWorkSessionDto) {
    return this.workSessionsService.update(id, updateWorkSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workSessionsService.remove(id);
  }
}
