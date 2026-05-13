import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { AbsenceType } from "../entities/absence.entity";

export class CreateAbsenceDto {
    @ApiProperty({ type: String, format: 'date-time' })
    @IsNotEmpty()
    @IsDateString()
    startDate: Date;

    @ApiProperty({ type: String, format: 'date-time' })
    @IsNotEmpty()
    @IsDateString()
    endDate: Date;

    @ApiProperty({ type: () => AbsenceType })
    @IsNotEmpty()
    @IsEnum(AbsenceType)
    type: AbsenceType;

    @ApiPropertyOptional({ type: String, format: 'uuid' })
    @IsOptional()
    @IsString()
    userId: string;
}
