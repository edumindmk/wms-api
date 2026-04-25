import { Injectable } from '@nestjs/common';
import { CreateWorkSessionDto } from './dto/create-work-session.dto';
import { UpdateWorkSessionDto } from './dto/update-work-session.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WorkSessionsService {
  constructor(private readonly usersService: UsersService) {}

  create(createWorkSessionDto: CreateWorkSessionDto) {
    const userId = createWorkSessionDto?.userId;

    const user = this.usersService.findOne(userId);

    const workSession = {
      user,
      ...createWorkSessionDto,
    };

    return 'This action adds a new workSession';
  }

  findAll() {
    return `This action returns all workSessions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workSession`;
  }

  update(id: number, updateWorkSessionDto: UpdateWorkSessionDto) {
    return `This action updates a #${id} workSession`;
  }

  remove(id: number) {
    return `This action removes a #${id} workSession`;
  }
}
