import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private users: string[] = [];

  constructor(private readonly configService: ConfigService) {}

  create(createUserDto: any) {
    this.users.push(createUserDto);

    return 'User created successfully';
  }

  findAll() {
    const databaseUrl = this.configService.get('databaseUrl');
    const jwtSecret = this.configService.get('jwtSecret');
    const port = this.configService.get('port');
    console.log(databaseUrl);
    console.log(jwtSecret);
    console.log(port);

    return this.users;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
