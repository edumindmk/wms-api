import { Role } from '../role.enum';

export type CreateUserType = {
  name: string;
  email: string;
  password: string;
  role: Role;
}
