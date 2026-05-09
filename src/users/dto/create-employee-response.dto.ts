import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class CreateEmployeeResponseDto {
  @ApiProperty({ example: 'User created successfully' })
  message: string;

  @ApiProperty({ type: () => User })
  user: User;
}
