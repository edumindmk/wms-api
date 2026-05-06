import { User } from "src/users/entities/user.entity";

export type CreateCompanyType = {
  name: string;
  address?: string;
  owner: User;
}