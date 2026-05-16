import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import {
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Absence, AbsenceStatus } from './entities/absence.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AbsencesService {
  constructor(
    @InjectRepository(Absence)
    private absenceRepository: Repository<Absence>,
  ) {}

  create(
    userId: string,
    companyId: string,
    createAbsenceDto: CreateAbsenceDto,
  ) {
    const startDate = new Date(createAbsenceDto.startDate);
    const endDate = new Date(createAbsenceDto.endDate);

    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (startDate < new Date()) {
      throw new BadRequestException('Start date must be in the future');
    }

    if (endDate < new Date()) {
      throw new BadRequestException('End date must be in the future');
    }

    try {
      const absence = this.absenceRepository.create({
        user: { id: userId },
        company: { id: companyId },
        startDate,
        endDate,
        type: createAbsenceDto.type,
        status: AbsenceStatus.PENDING,
        totalDays: Math.ceil(endDate.getDate() - startDate.getDate() + 1),
      });

      return this.absenceRepository.save(absence);
    } catch (error) {
      throw new BadRequestException('Failed to create absence');
    }
  }

  async findAllForCompany(companyId: string) {
    try {
      const [absences, count] = await this.absenceRepository.findAndCount({
        where: {
          company: { id: companyId },
        },
        relations: ['user', 'company'],
      });

      return { absences, count };
    } catch (error) {
      throw new BadRequestException('Failed to get absences');
    }
  }

  async findAllForUser(userId: string) {
    try {
      const [absences, count] = await this.absenceRepository.findAndCount({
        where: {
          user: { id: userId },
        },
      });

      return { absences, count };
    } catch (error) {
      throw new BadRequestException('Failed to get absences');
    }
  }

  async updateForUser(
    userId: string,
    id: string,
    updateAbsenceDto: UpdateAbsenceDto,
  ) {
    try {
      const absence = await this.absenceRepository.findOne({
        where: { id, user: { id: userId } },
      });

      if (!absence) {
        throw new NotFoundException('Absence not found');
      }

      if (absence.status !== AbsenceStatus.PENDING) {
        throw new BadRequestException('Absence is not pending to be updated');
      }

      if (updateAbsenceDto.startDate) {
        absence.startDate = new Date(updateAbsenceDto.startDate);
      }
      if (updateAbsenceDto.endDate) {
        absence.endDate = new Date(updateAbsenceDto.endDate);
      }
      if (updateAbsenceDto.type) {
        absence.type = updateAbsenceDto.type;
      }

      return this.absenceRepository.save(absence);
    } catch (error) {
      throw new BadRequestException('Failed to update absence');
    }
  }

  async updateForCompany(
    companyId: string,
    id: string,
    updateAbsenceDto: UpdateAbsenceDto,
  ) {
    try {
      const absence = await this.absenceRepository.findOne({
        where: { id, company: { id: companyId } },
      });

      if (!absence) {
        throw new NotFoundException('Absence not found');
      }

      if (updateAbsenceDto.startDate) {
        absence.startDate = new Date(updateAbsenceDto.startDate);
      }
      if (updateAbsenceDto.endDate) {
        absence.endDate = new Date(updateAbsenceDto.endDate);
      }
      if (updateAbsenceDto.type) {
        absence.type = updateAbsenceDto.type;
      }
      if (updateAbsenceDto.status) {
        absence.status = updateAbsenceDto.status;
      }

      return this.absenceRepository.save(absence);
    } catch (error) {
      throw new BadRequestException('Failed to update absence');
    }
  }

  async delete(companyId: string, id: string) {
    try {
      const absence = await this.absenceRepository.findOne({
        where: { id, company: { id: companyId } },
      });

      if (!absence) {
        throw new NotFoundException('Absence not found');
      }

      await this.absenceRepository.delete(id);

      return { message: 'Absence deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete absence');
    }
  }

  async findAllReports(
    companyId: string,
    startDate?: string,
    endDate?: string,
    employeeId?: string,
  ) {
    try {
      const where: FindOptionsWhere<Absence> = {
        company: { id: companyId },
      };

      if (startDate?.trim()) {
        where.startDate = MoreThanOrEqual(new Date(startDate));
      }
      if (endDate?.trim()) {
        where.endDate = LessThanOrEqual(new Date(endDate));
      }
      if (employeeId?.trim()) {
        where.user = { id: employeeId };
      }

      const absences = await this.absenceRepository.find({
        where,
        relations: ['user', 'company'],
      });

      return { absences, count: absences.length };
    } catch (error) {
      throw new BadRequestException('Failed to get absences');
    }
  }
}
