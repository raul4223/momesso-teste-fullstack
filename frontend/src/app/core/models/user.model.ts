import { Company } from './company.model';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  companyId: string;
  company?: Company;
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
  companyId: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: 'ADMIN' | 'USER';
  companyId?: string;
}