import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAbsenceDto } from './create-absence.dto';
import { AbsenceStatus } from '../entities/absence.entity';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateAbsenceDto extends PartialType(CreateAbsenceDto) {
    @ApiProperty({ type: () => AbsenceStatus })
    @IsOptional()
    @IsEnum(AbsenceStatus)
    status?: AbsenceStatus;
}
