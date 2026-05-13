import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateAbsenceDto } from './create-absence.dto';
import { AbsenceStatus } from '../entities/absence.entity';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateAbsenceDto extends PartialType(CreateAbsenceDto) {
    @ApiPropertyOptional({ enum: AbsenceStatus })
    @IsOptional()
    @IsEnum(AbsenceStatus)
    status?: AbsenceStatus;
}
