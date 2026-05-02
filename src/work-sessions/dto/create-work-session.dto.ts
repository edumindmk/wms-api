import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateWorkSessionDto {
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
