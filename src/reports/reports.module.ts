import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { WorkSessionsModule } from 'src/work-sessions/work-sessions.module';
import { AbsencesModule } from 'src/absences/absences.module';

@Module({
  imports: [WorkSessionsModule, AbsencesModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
