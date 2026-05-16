import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from 'src/common/types/auth-request.type';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/users/roles.decorator';
import { Role } from 'src/users/role.enum';
import { RolesGuard } from 'src/users/roles.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('company')
  @Roles(Role.ADMIN)
  @ApiQuery({ name: 'startDate', type: String, required: false })
  @ApiQuery({ name: 'endDate', type: String, required: false })
  @ApiQuery({ name: 'employeeId', type: String, required: false })
  @ApiOperation({ summary: 'Get reports for company' })
  @ApiUnauthorizedResponse()
  getReportsForCompany(
    @Req() req: AuthenticatedRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.reportsService.getReportsForCompany(
      req.user.companyId,
      startDate,
      endDate,
      employeeId,
    );
  }
  
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Get('employee')
  @ApiQuery({ name: 'startDate', type: String, required: false })
  @ApiQuery({ name: 'endDate', type: String, required: false })
  @ApiOperation({ summary: 'Get reports for employee' })
  @ApiUnauthorizedResponse()
  getReportsForEmployee(
    @Req() req: AuthenticatedRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getReportsForEmployee(
      req.user.companyId,
      req.user.userId,
      startDate,
      endDate,
    );
  }
}
