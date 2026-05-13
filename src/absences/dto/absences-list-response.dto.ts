import { ApiProperty } from '@nestjs/swagger';
import { Absence } from '../entities/absence.entity';

export class AbsencesListResponseDto {
  @ApiProperty({ type: [Absence] })
  absences: Absence[];

  @ApiProperty()
  count: number;
}
