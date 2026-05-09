import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkSessionDto {
  @ApiProperty({ type: String, format: 'date-time', example: '2026-05-09T09:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  startAt: Date;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-05-09T17:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  endAt: Date;

  @ApiPropertyOptional({ example: 'Warehouse inbound shift' })
  @IsOptional()
  @IsString()
  description: string;
}
