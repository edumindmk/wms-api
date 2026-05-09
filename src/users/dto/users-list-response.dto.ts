import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UsersListResponseDto {
  @ApiProperty({ type: [User] })
  users: User[];

  @ApiProperty()
  count: number;
}
