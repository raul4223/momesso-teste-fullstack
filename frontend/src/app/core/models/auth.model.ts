// Dados enviados no login.
export interface LoginRequest {
  email: string;
  password: string;
}

// Usuário retornado pela API após login.
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  companyId: string;
}

// Resposta completa do endpoint de login.
export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}
