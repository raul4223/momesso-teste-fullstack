import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ForbiddenException } from '@nestjs/common';
import { Role } from '../common/enums/role.enum';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';

@Injectable()
export class CompaniesService {
    constructor(
        //permite usar metodos do TypeORM
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>
    ){}
    // CREATE
    async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
        //verifica se ja existe uma empresa com o mesmo cnpj
        const companyAlreadyExists = await this.companyRepository.findOne({
            where: {
                cnpj: createCompanyDto.cnpj,
            },
        });
        
        if(companyAlreadyExists){
            throw new ConflictException('Já existe uma empresa com esse CNPJ.')
        }

        //cria apenas uma instancia da entidade em memoria e nao salva no banco
        const company = this.companyRepository.create(createCompanyDto);

        return this.companyRepository.save(company);

    }

    //READ
    //todas as empresas 
    async findAll(user: AuthenticatedUser): Promise<Company[]> {
       if (user.role === Role.ADMIN) {
        return this.companyRepository.find({
            order: { createdAt: 'DESC',},
        });
       }

       const company = await this.companyRepository.findOne({
        where: { id: user.companyId, },
       });

       return company ? [company] : [];
    }
    //busca uma empresa pelo ID
    async findOne(id: string, user?: AuthenticatedUser): Promise<Company> {
        const company = await this.companyRepository.findOne({
            where: { id,},
        });

        if(!company) {
            throw new NotFoundException('Empresa não encontrada.');
        }

        if(user && user.role !== Role.ADMIN && company.id !== user.companyId) {
            throw new ForbiddenException('Você não tem permissão para acessar essa empresa.')
        }

        return company;
    }

    //UPDATE
    async update(
        id: string,
        updateCompanyDto: UpdateCompanyDto,): Promise<Company> {
            const company = await this.findOne(id);

            if(updateCompanyDto.cnpj && updateCompanyDto.cnpj !== company.cnpj) {
                const companyWithSameCnpj = await this.companyRepository.findOne({
                    where: { cnpj: updateCompanyDto.cnpj, },
                });

                if(companyWithSameCnpj) {
                    throw new ConflictException('Já Existe uma empresa com esse CNPJ.');
                }
            }

            //junta os dados antigos com os novos
            this.companyRepository.merge(company, updateCompanyDto);

            return this.companyRepository.save(company);
        }

        //DELETE
        async remove(id: string): Promise<void> {
            const company = await this.findOne(id);

            await this.companyRepository.remove(company);
        }
        
}
