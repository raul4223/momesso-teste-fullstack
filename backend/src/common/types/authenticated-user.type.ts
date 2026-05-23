import { Role } from '../enums/role.enum';

//Representa os dados do usuario que vem do JWT
export type AuthenticatedUser = {
  id: string;
  email: string;
  role: Role;
  companyId: string;
};