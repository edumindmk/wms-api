import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  address: string;

  @IsNotEmpty()
  @IsUUID('4')
  ownerId: string;
}
