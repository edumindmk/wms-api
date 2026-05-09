import { IsEnum, IsObject, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../role.enum';
import { Company } from 'src/companies/entities/company.entity';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  password?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsOptional()
  @IsObject()
  company: Company;
}
