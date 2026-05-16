import { Injectable } from '@nestjs/common';
import { AbsencesService } from 'src/absences/absences.service';
import { WorkSessionsService } from 'src/work-sessions/work-sessions.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly workSessionsService: WorkSessionsService,
    private readonly absencesService: AbsencesService,
  ) {}

  async getReportsForCompany(
    companyId: string,
    startDate?: string,
    endDate?: string,
    employeeId?: string,
  ) {
    const workSessions = await this.workSessionsService.findAllReports(
      companyId,
      startDate,
      endDate,
      employeeId,
    );

    const absences = await this.absencesService.findAllReports(
      companyId,
      startDate,
      endDate,
      employeeId,
    );

    return { workSessions, absences };
  }

  async getReportsForEmployee(
    companyId: string,
    employeeId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const workSessions = await this.workSessionsService.findAllReports(
      companyId,
      startDate,
      endDate,
      employeeId,
    );

    const absences = await this.absencesService.findAllReports(
      companyId,
      startDate,
      endDate,
      employeeId,
    );

    return { workSessions, absences };
  }
}
