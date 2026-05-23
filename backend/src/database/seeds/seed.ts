import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { Company } from '../../companies/company.entity';
import { User } from '../../users/user.entity';
import { Role } from '../../common/enums/role.enum';
import { Machine } from '../../machines/machine.entity';

const AppDataSource = new DataSource({
  type: 'postgres',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [Company, User, Machine],

  synchronize: false,
});

async function runSeed() {

  await AppDataSource.initialize();

  console.log('Conectado ao banco de dados.');

  const companyRepository = AppDataSource.getRepository(Company);
  const userRepository = AppDataSource.getRepository(User);

  let company = await companyRepository.findOne({
    where: {
      cnpj: '00000000000100',
    },
  });

  if (!company) {
    company = companyRepository.create({
      name: 'Empresa Admin',
      cnpj: '00000000000100',
    });

    company = await companyRepository.save(company);

    console.log('Empresa inicial criada.');
  } else {
    console.log('Empresa inicial já existe.');
  }

  const adminAlreadyExists = await userRepository.findOne({
    where: {
      email: 'admin@teste.com',
    },
  });

  if (!adminAlreadyExists) {

    const hashedPassword = await bcrypt.hash('123456', 10);

    const adminUser = userRepository.create({
      name: 'Administrador',
      email: 'admin@teste.com',
      password: hashedPassword,
      role: Role.ADMIN,
      companyId: company.id,
    });

    await userRepository.save(adminUser);

    console.log('Usuário ADMIN inicial criado.');
  } else {
    console.log('Usuário ADMIN inicial já existe.');
  }

  await AppDataSource.destroy();

  console.log('Seed finalizado com sucesso.');
}

runSeed().catch(async (error) => {
  console.error('Erro ao executar seed:', error);

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }

  process.exit(1);
});