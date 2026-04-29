import { IsDate, IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateWorkSessionDto {
  @IsNotEmpty()
  @IsUUID('4')
  userId: string;

  @IsNotEmpty()
  @IsDateString()
  startAt: Date;

  @IsNotEmpty()
  @IsDateString()
  endAt: Date;

  @IsOptional()
  @IsString()
  description: string;
}
