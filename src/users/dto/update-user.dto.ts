import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../role.enum';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role;
}
