import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateWorkSessionDto {
  @IsOptional()
  @IsUUID('4')
  userId?: string;

  @IsOptional()
  @IsDateString()
  startAt: Date;

  @IsOptional()
  @IsDateString()
  endAt: Date;

  @IsOptional()
  @IsString()
  description: string;
}
