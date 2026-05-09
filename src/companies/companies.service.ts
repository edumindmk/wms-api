import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyType } from './types/create-company.type';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { isPostgresUniqueViolation } from 'src/common/utils/postgres-unique-violation';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async createCompany(createCompany: CreateCompanyType) {
    try {
      const company = this.companyRepository.create(createCompany);
      await this.companyRepository.save(company);

      return company;
    } catch (error) {
      if (error instanceof QueryFailedError && isPostgresUniqueViolation(error)) {
        throw new BadRequestException('Company already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return this.companyRepository.find();
  }

  async assignUserToCompany(userId: string, companyId: string) {
    const user = await this.usersService.findOne(userId);
    const company = await this.companyRepository.findOne({ where: { id: companyId } });

    if (!user || !company) {
      throw new NotFoundException('User or company not found');
    }

    await this.usersService.update(userId, { company });

    return { message: 'User assigned to company successfully', user };
  }
}

