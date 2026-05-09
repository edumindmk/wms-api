import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateWorkSessionDto {
  @ApiPropertyOptional({ format: 'uuid', description: 'Reassign session to another user (admin workflow)' })
  @IsOptional()
  @IsUUID('4')
  userId?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  startAt: Date;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  endAt: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;
}
