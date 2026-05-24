# Momesso Fullstack Challenge

Aplicacao full stack para gerenciamento de empresas, usuarios e maquinas, desenvolvida como teste tecnico. O projeto possui uma API em NestJS com autenticacao JWT e um front-end em Angular standalone para operacao dos CRUDs.

## Tecnologias utilizadas

### Back-end

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- JWT com Passport
- bcrypt para hash de senha
- class-validator e class-transformer

### Front-end

- Angular standalone
- TypeScript
- SCSS
- Angular Router
- HttpClient
- Interceptor JWT
- AuthGuard

### Banco de dados

- PostgreSQL
- Docker Compose para subir o banco localmente

## Funcionalidades

- Login com JWT
- Logout
- Rotas protegidas no front-end
- Interceptor enviando `Authorization: Bearer <token>`
- Dashboard com totais do sistema
- CRUD de empresas
- CRUD de usuarios
- CRUD de maquinas
- Controle visual por perfil no front-end
- Controle de acesso por role no back-end
- Seed para usuario administrador inicial

## Estrutura do projeto

```txt
.
├── backend
│   ├── src
│   │   ├── auth
│   │   ├── common
│   │   ├── companies
│   │   ├── database
│   │   ├── machines
│   │   └── users
│   └── package.json
├── frontend
│   ├── src
│   │   ├── app
│   │   │   ├── core
│   │   │   ├── features
│   │   │   └── shared
│   │   └── environments
│   └── package.json
└── docker-compose.yaml
```

## Requisitos para rodar

- Node.js LTS
- npm
- Docker e Docker Compose
- Git

## Como rodar o projeto

### 1. Clonar o repositorio

```bash
git clone <url-do-repositorio>
cd momesso-test
```

### 2. Subir o PostgreSQL

Na raiz do projeto:

```bash
docker compose up -d
```

O banco sera criado com as credenciais definidas em `docker-compose.yaml`:

```txt
POSTGRES_USER=root
POSTGRES_PASSWORD=root
POSTGRES_DB=momesso_db
```

### 3. Configurar o back-end

Entre na pasta do back-end:

```bash
cd backend
npm install
```

Crie o arquivo `.env` com base no exemplo:

```bash
cp .env.example .env
```

Para usar o banco do `docker-compose.yaml`, deixe o `.env` assim:

```env
PORT=3000
FRONTEND_URL=http://localhost:4200

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=momesso_db

JWT_SECRET=coloque_uma_chave_segura_aqui
JWT_EXPIRES_IN=1d
```

Inicie a API:

```bash
npm run start:dev
```

A API ficara disponivel em:

```txt
http://localhost:3000
```

### 4. Rodar o seed

Com o banco ativo e a API ja tendo criado as tabelas, rode em outro terminal:

```bash
cd backend
npm run seed
```

O seed cria:

- Empresa inicial: `Empresa Admin`
- Usuario administrador:
  - E-mail: `admin@teste.com`
  - Senha: `123456`

### 5. Configurar o front-end

Em outro terminal, a partir da raiz do projeto:

```bash
cd frontend
npm install
```

O front-end usa a API em:

```ts
http://localhost:3000
```

Essa configuracao esta em:

```txt
frontend/src/environments/environment.ts
```

Inicie o front-end:

```bash
npm start
```

A aplicacao ficara disponivel em:

```txt
http://localhost:4200
```

## Credenciais de acesso

Apos rodar o seed:

```txt
E-mail: admin@teste.com
Senha: 123456
```

## Rotas principais da API

### Auth

- `POST /auth/login`

### Empresas

- `POST /companies`
- `GET /companies`
- `GET /companies/:id`
- `PATCH /companies/:id`
- `DELETE /companies/:id`

### Usuarios

- `POST /users`
- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`

### Maquinas

- `POST /machines`
- `GET /machines`
- `GET /machines/:id`
- `PATCH /machines/:id`
- `DELETE /machines/:id`

## Regras de acesso

O sistema utiliza autenticacao JWT e controle por role.

- `ADMIN`: pode visualizar e gerenciar todos os registros.
- `USER`: visualiza apenas dados relacionados a sua empresa.

No front-end, botoes administrativos sao exibidos apenas para usuarios `ADMIN`. A protecao principal das rotas e operacoes fica no back-end.

## Telas do front-end

- Login
- Dashboard com totais reais do sistema
- Listagem de empresas
- Criacao e edicao de empresas
- Listagem de usuarios
- Criacao e edicao de usuarios
- Listagem de maquinas
- Criacao e edicao de maquinas

## Scripts uteis

### Back-end

```bash
cd backend

npm run start:dev
npm run build
npm run test
npm run test:e2e
npm run seed
```

### Front-end

```bash
cd frontend

ng serve
npm start
npm run build
npm test
```
