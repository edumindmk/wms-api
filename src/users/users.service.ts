import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { throwEmailAlreadyExists, throwUserNotFound } from 'src/common/errors';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return { message: 'User created successfully', user };
    } catch (e: unknown) {
      if (e instanceof QueryFailedError && isPostgresUniqueViolation(e)) {
        throwEmailAlreadyExists();
      }
      throw e;
    }
  }

  async findAll() {
    const users = await this.userRepository.find();

    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throwUserNotFound();
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throwUserNotFound();
    }

    const normalizedUpdateUserDto = pickDefined(updateUserDto);

    const updatedUser = await this.userRepository.save({
      ...user,
      ...normalizedUpdateUserDto,
    });

    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throwUserNotFound();
    }

    await this.userRepository.delete(id);

    return { message: 'User deleted successfully' };
  }
}

export function pickDefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

function isPostgresUniqueViolation(e: {
  code?: string;
  driverError?: { code?: string };
}): boolean {
  return e.code === '23505' || e.driverError?.code === '23505';
}
