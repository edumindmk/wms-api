import { Role } from '../role.enum';

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  ownedCompany?: { id: string; name: string };
  company?: { id: string; name: string };
};
