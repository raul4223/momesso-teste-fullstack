import { Company } from './company.model';

export interface Machine {
  id: string;
  name: string;
  serialNumber: string;
  companyId: string;
  company?: Company;
  createdAt: string;
}

export interface CreateMachineRequest {
  name: string;
  serialNumber: string;
  companyId: string;
}

export interface UpdateMachineRequest {
  name?: string;
  serialNumber?: string;
  companyId?: string;
}