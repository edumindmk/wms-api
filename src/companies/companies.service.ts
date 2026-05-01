import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const owner = await this.userRepository.findOne({
      where: { id: createCompanyDto.ownerId },
      relations: ['company'],
    });

    if (!owner) {
      throw new NotFoundException('Owner user not found');
    }

    const company = this.companyRepository.create({
      name: createCompanyDto.name,
      address: createCompanyDto.address,
      owner,
    });

    const savedCompany = await this.companyRepository.save(company);

    owner.company = savedCompany;
    await this.userRepository.save(owner);

    return this.findOne(savedCompany.id);
  }

  findAll() {
    return this.companyRepository.find({
      relations: ['owner', 'users'],
    });
  }

  async findOne(id: string) {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['owner', 'users'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (updateCompanyDto.ownerId) {
      const previousOwner = company.owner;
      const owner = await this.userRepository.findOne({
        where: { id: updateCompanyDto.ownerId },
      });

      if (!owner) {
        throw new NotFoundException('Owner user not found');
      }

      company.owner = owner;
      owner.company = company;
      await this.userRepository.save(owner);

      if (previousOwner?.id && previousOwner.id !== owner.id) {
        previousOwner.company = null;
        await this.userRepository.save(previousOwner);
      }
    }

    if (updateCompanyDto.name !== undefined) {
      company.name = updateCompanyDto.name;
    }

    if (updateCompanyDto.address !== undefined) {
      company.address = updateCompanyDto.address;
    }

    await this.companyRepository.save(company);

    return this.findOne(id);
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
