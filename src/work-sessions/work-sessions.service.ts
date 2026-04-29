import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkSessionDto } from './dto/create-work-session.dto';
import { UpdateWorkSessionDto } from './dto/update-work-session.dto';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkSession } from './entities/work-session.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class WorkSessionsService {
  constructor(private readonly usersService: UsersService, 
    @InjectRepository(WorkSession) 
    private workSessionRepository: Repository<WorkSession>
  ) {}

  async create(createWorkSessionDto: CreateWorkSessionDto) {
    const userId = createWorkSessionDto?.userId;
    const startAt = new Date(createWorkSessionDto.startAt);
    const endAt = new Date(createWorkSessionDto.endAt);

    await this.checkOverlap(startAt, endAt, userId);

    const workSession = this.workSessionRepository.create({
      ...createWorkSessionDto,
      startAt,
      endAt,
      user: { id: userId },
    });

    await this.workSessionRepository.save(workSession);

    return workSession;
  }

  getWorkSessionsByUserIdAndDate(userId: string, date: Date) {
    const d = new Date(date);
    const dayStart = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      0,
      0,
      0,
      0,
    );
    const dayEnd = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      23,
      59,
      59,
      999,
    );

    return this.workSessionRepository.find({
      where: {
        user: { id: userId },
        startAt: LessThanOrEqual(dayEnd),
        endAt: MoreThanOrEqual(dayStart),
      },
    });
  }

  findAll() {
    return this.workSessionRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: string) {
    const workSession = await this.workSessionRepository.findOne({ where: { id }, relations: ['user'] });

    if (!workSession) {
      throw new NotFoundException('Work session not found');
    }

    return workSession;
  }

  async update(id: string, updateWorkSessionDto: UpdateWorkSessionDto) {
    const workSession = await this.workSessionRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!workSession) {
      throw new NotFoundException('Work session not found');
    }

    const userId =
      updateWorkSessionDto.userId ?? workSession.user.id;
    const startAt =
      updateWorkSessionDto.startAt
        ? new Date(updateWorkSessionDto.startAt)
        : updateWorkSessionDto.startAt;
    const endAt =
      updateWorkSessionDto.endAt
        ? new Date(updateWorkSessionDto.endAt)
        : updateWorkSessionDto.endAt;

    if (startAt && endAt) {
      await this.checkOverlap(startAt, endAt, userId, { excludeWorkSessionId: id });
    }

    if (updateWorkSessionDto.startAt != null) {
      workSession.startAt = new Date(updateWorkSessionDto.startAt);
    }
    if (updateWorkSessionDto.endAt != null) {
      workSession.endAt = new Date(updateWorkSessionDto.endAt);
    }
    if (updateWorkSessionDto.description != null) {
      workSession.description = updateWorkSessionDto.description;
    }

    return this.workSessionRepository.save(workSession);
  }

  async checkOverlap(
    startAt: Date,
    endAt: Date,
    userId: string,
    options?: { excludeWorkSessionId?: string },
  ) {
    if (endAt.getTime() <= startAt.getTime()) {
      throw new BadRequestException('endAt must be after startAt');
    }

    const currentWorkSessions = await this.getWorkSessionsByUserIdAndDate(userId, startAt);

    for (const session of currentWorkSessions) {
      if (options?.excludeWorkSessionId === session.id) {
        continue;
      }
      if (startAt < session.endAt && endAt > session.startAt) {
        throw new BadRequestException(
          'This work session overlaps an existing work session for this user',
        );
      }
    }
  }

  async remove(id: string) {
    const workSession = await this.workSessionRepository.findOne({ where: { id } });

    if (!workSession) {
      throw new NotFoundException('Work session not found');
    }

    await this.workSessionRepository.delete(id);

    return { message: 'Work session deleted successfully' };
  }
}
