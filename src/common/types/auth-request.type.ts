import { Role } from "src/users/role.enum";
import { Request } from "express";

export type AuthenticatedRequest = Request & {
  user: { userId: string; email: string; companyId: string, role: Role };
};