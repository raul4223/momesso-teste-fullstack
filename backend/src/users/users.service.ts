import { Injectable, ConflictException, NotFoundException, Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Company } from 'src/companies/company.entity';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForbiddenException } from '@nestjs/common';
import { Role } from '../common/enums/role.enum';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
    ) {}

    //CREATE
    async create(createUserDto: CreateUserDto): Promise<User> {
        const userAlreadyExists = await this.userRepository.findOne({
            where: { email: createUserDto.email, },
        });

        if(userAlreadyExists) {
            throw new ConflictException('Já existe um usuário com este e-mail.');
        }

        const company = await this.companyRepository.findOne({
            where: { id: createUserDto.companyId, },
        });

        if(!company) {
            throw new NotFoundException('Empresa não encontrada.');
        }
        
        //mistura a senha 10vezes com Salt
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });

        return this.userRepository.save(user);    
    }

    //READ
    //todos usuarios
    async findAll(user: AuthenticatedUser): Promise<User[]> {
        if(user.role === Role.ADMIN) {
            return this.userRepository.find({
                relations: { company: true,},
                order: { createdAt: 'DESC',},
            });
        }

        return this.userRepository.find({
            where: { companyId: user.companyId,},
            relations: { company: true,},
            order: { createdAt: 'DESC',},
        });
    }

    //buscar usuario pelo ID
    async findOne(id: string, user?: AuthenticatedUser): Promise<User> {
        const foundUser = await this.userRepository.findOne({
            where: { id, },
            relations: { company: true,}
        });

        if(!foundUser) {
            throw new NotFoundException('Usuário não encontrado.')
        }

        if(user && user.role !== Role.ADMIN && foundUser.companyId !== user.companyId) {
            throw new ForbiddenException('Você não tem permissão para acessar este usuário')
        }

        return foundUser;
    }

    //buscar usuario pelo email
    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { email,},
            relations: { company: true, },
        });
    }

    //UPDATE
    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        //se o email for alterado, verifica se ja pertence a outro usuario
        if(updateUserDto.email && updateUserDto.email !== user.email) {
            const userWithSameEmail = await this.userRepository.findOne({
                where: { email: updateUserDto.email,},
            });

            if(userWithSameEmail) {
                throw new ConflictException('Ja existe um usuario com este e-mail.');
            }
        }

        //se a empresa for alterada verifica se a empresa existe
        if(updateUserDto.companyId) {
            const company = await this.companyRepository.findOne({
                where: { id: updateUserDto.companyId, },
            });

            if(!company) {
                throw new ConflictException('Empresa não encontrada');
            }
        }

        //novo hash para nova senha
        if(updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        //junta dados antigos com os novos
        this.userRepository.merge(user,updateUserDto);

        return this.userRepository.save(user);
    }

    //DELETE
    async remove(id: string): Promise<void> {
        const user = await this.findOne(id);

        await this.userRepository.remove(user);
    }
}
