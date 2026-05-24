export interface Company {
  id: string;
  name: string;
  cnpj: string;
  createdAt: string;
}

export interface CreateCompanyRequest {
  name: string;
  cnpj: string;
}


export interface UpdateCompanyRequest {
  name?: string;
  cnpj?: string;
}