import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../role.enum';
import { Company } from 'src/companies/entities/company.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Jane Employee' })
  @IsString()
  @IsOptional()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({ minLength: 8 })
  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  password?: string;

  @ApiPropertyOptional({ enum: Role })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({ description: 'Company relation payload for advanced updates' })
  @IsOptional()
  @IsObject()
  company: Company;
}
