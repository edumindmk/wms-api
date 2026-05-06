import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyType } from './types/create-company.type';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { isPostgresUniqueViolation } from 'src/common/utils/postgres-unique-violation';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
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
}

