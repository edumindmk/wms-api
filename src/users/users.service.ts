import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserType } from './types/create-user';
import { throwEmailAlreadyExists, throwUserNotFound } from 'src/common/errors';
import * as bcrypt from 'bcrypt';
import { CreateUserEmployeeDto } from './dto/create-user-employee.dto';
import { Role } from './role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async createEmployee(createUserDto: CreateUserEmployeeDto) {
    return this.createUser({ ...createUserDto, role: Role.USER });
  }

  async createUser(createUser: CreateUserType) {
    try {
      const hashedPassword = await bcrypt.hash(createUser.password, 10);
      
      const user = this.userRepository.create({ ...createUser, password: hashedPassword });
      await this.userRepository.save(user);

      return { message: 'User created successfully', user };
    } catch (e: unknown) {
      if (e instanceof QueryFailedError && isPostgresUniqueViolation(e)) {
        throwEmailAlreadyExists();
      }
      throw e;
    }
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    return user;
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
