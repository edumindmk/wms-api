import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, QueryFailedError, Repository } from 'typeorm';
import { CreateUserType } from './types/create-user';
import { throwEmailAlreadyExists, throwUserNotFound } from 'src/common/errors';
import * as bcrypt from 'bcrypt';
import { CreateUserEmployeeDto } from './dto/create-user-employee.dto';
import { Role } from './role.enum';
import { isPostgresUniqueViolation } from 'src/common/utils/postgres-unique-violation';
import { CompaniesService } from 'src/companies/companies.service';
import { Company } from 'src/companies/entities/company.entity';
import { PublicUser } from './types/public-user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => CompaniesService))
    private companiesService: CompaniesService,
  ) {}

  async createEmployee(companyId: string, createUserDto: CreateUserEmployeeDto) {
    const { user: created } = await this.createUser({ ...createUserDto, role: Role.USER });
    await this.companiesService.assignUserToCompany(created.id, companyId);
    return {
      message: 'User created successfully',
      user: await this.findProfile(created.id),
    };
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
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['ownedCompany', 'company'],
    });

    return user;
  }

  async findAll(companyId: string) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.ownedCompany', 'ownedCompany')
      .leftJoinAndSelect('user.company', 'company')
      .where(
        new Brackets((qb) => {
          qb.where('company.id = :companyId', { companyId }).orWhere(
            'ownedCompany.id = :companyId',
            { companyId },
          );
        }),
      )
      .select(['user.id', 'user.name', 'user.email', 'user.role', 'ownedCompany.id', 'company.id'])
      .getMany();

    return { users, count: users.length };
  }

  toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      ...(user.ownedCompany && {
        ownedCompany: { id: user.ownedCompany.id, name: user.ownedCompany.name },
      }),
      ...(user.company && { company: { id: user.company.id, name: user.company.name } }),
    };
  }

  async findProfile(id: string): Promise<PublicUser> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['ownedCompany', 'company'],
    });

    if (!user) {
      throwUserNotFound();
    }

    return this.toPublicUser(user);
  }

  isUserInCompany(user: User, companyId: string): boolean {
    return user.company?.id === companyId || user.ownedCompany?.id === companyId;
  }

  async requireUserInCompany(userId: string, companyId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['ownedCompany', 'company'],
    });
    if (!user) {
      throwUserNotFound();
    }
    if (!this.isUserInCompany(user, companyId)) {
      throwUserNotFound();
    }
    return user;
  }

  async findOneInCompany(id: string, companyId: string): Promise<PublicUser> {
    const user = await this.requireUserInCompany(id, companyId);
    return this.toPublicUser(user);
  }

  async updateInCompany(id: string, companyId: string, updateUserDto: UpdateUserDto): Promise<PublicUser> {
    const user = await this.requireUserInCompany(id, companyId);
    const normalizedUpdateUserDto = pickDefined(updateUserDto);
    if (normalizedUpdateUserDto.password) {
      normalizedUpdateUserDto.password = await bcrypt.hash(normalizedUpdateUserDto.password, 10);
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      ...normalizedUpdateUserDto,
    });

    return this.toPublicUser(updatedUser);
  }

  async removeFromCompany(id: string, companyId: string) {
    await this.requireUserInCompany(id, companyId);
    await this.userRepository.delete(id);
    return { message: 'User deleted successfully' };
  }

  /** Internal: set the employee company relation without going through PATCH DTO. */
  async linkUserToCompany(userId: string, companyId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throwUserNotFound();
    }
    user.company = { id: companyId } as Company;
    await this.userRepository.save(user);
  }
}

export function pickDefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
}
