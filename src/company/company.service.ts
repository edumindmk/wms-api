import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class CompanyService {

  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) { }

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const ownerId = createCompanyDto?.ownerId;
      const company = this.companyRepository.create({
        ...createCompanyDto,
        owner: { id: ownerId }
      });
      await this.companyRepository.save(company);
      return { message: 'Company created successfully', company };
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.companyRepository.find({
      relations: ['owner', 'users'],
    });
  }

  async findOne(id: string) {
    const company = await this.companyRepository.findOne({ where: { id }, relations: ['owner', 'users'] });
    if (!company) {
      throw new NotFoundException('Company not found');

    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.findOne({ where: { id }, relations: ['owner', 'users'] });
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (updateCompanyDto.name) {
      company.name = updateCompanyDto.name;
    }

    if (updateCompanyDto.address) {
      company.address = updateCompanyDto.address;
    }

    await this.companyRepository.save(company);
    return { message: 'Company updated successfully', company };
  }

  async remove(id: string) {
    const company = await this.companyRepository.findOne({ where: { id } });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    await this.companyRepository.delete(id);

    return { message: 'Company deleted successfully' };
  }
}
