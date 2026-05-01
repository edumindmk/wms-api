import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateCompanyDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsUUID('4')
    ownerId: string;
}
