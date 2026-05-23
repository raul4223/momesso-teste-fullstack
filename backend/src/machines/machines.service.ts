import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './machine.entity';
import { Company } from '../companies/company.entity';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { ForbiddenException } from '@nestjs/common';
import { Role } from '../common/enums/role.enum';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';

@Injectable()
export class MachinesService {
    constructor(
        @InjectRepository(Machine)
        private readonly machineRepository: Repository<Machine>,

        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
    ) {}

    //CREATE
    async create(createMachineDto: CreateMachineDto): Promise<Machine> {
        const machineAlreadyExists = await this.machineRepository.findOne({
            where: { serialNumber: createMachineDto.serialNumber,},
        });

        if(machineAlreadyExists) {
            throw new ConflictException('Já existe uma máquina com este número de série.');
        }

        const company = await this.companyRepository.findOne({
            where: { id: createMachineDto.companyId, },
        });

        if(!company) {
            throw new ConflictException('Empresa não encontrada.');
        }

        const machine = this.machineRepository.create(createMachineDto);

        return this.machineRepository.save(machine);
    }

    //READ
    //lista todas as maquinas
    async findAll(user: AuthenticatedUser): Promise<Machine[]> {
        if(user.role === Role.ADMIN) {
            return this.machineRepository.find({
                relations: { company: true,},
                order: { createdAt: 'DESC',},
            });
        }

        return this.machineRepository.find({
            where: { companyId: user.companyId, },
            relations: { company: true, },
            order: { createdAt: 'DESC',},
        });
    }

    //busca pelo ID da maquina
    async findOne(id: string, user?: AuthenticatedUser): Promise<Machine> {
        const machine = await this.machineRepository.findOne({
            where: { id, },
            relations: { company: true, },
        });

        if(!machine) {
            throw new NotFoundException('Maquina não encontrada.');
        }

        if(user && user.role !== Role.ADMIN && machine.companyId !== user.companyId) {
            throw new ForbiddenException('Você não tem permissão para acessar esta máquina.')
        }

        return machine;
    }

    //UPDATE
    async update(
        id: string,
        updateMachineDto: UpdateMachineDto,
    ): Promise<Machine> {
        const machine = await this.findOne(id);

        if(updateMachineDto.serialNumber && updateMachineDto.serialNumber !== machine.serialNumber) {
            const machineWithSameSerial = await this.machineRepository.findOne({
                where: { serialNumber: updateMachineDto.serialNumber, },
            });
            
            if(machineWithSameSerial) {
                throw new ConflictException('Já existe uma máquina com este número de série.');
            }
        }

        if(updateMachineDto.companyId) {
            const company = await this.companyRepository.findOne({
                where: { id: updateMachineDto.companyId, },
            });

            if(!company) {
                throw new NotFoundException('Empresa não encontrada.');
            }
        }

        this.machineRepository.merge(machine, updateMachineDto);

        return this.machineRepository.save(machine);
    }

    async remove(id: string): Promise<void> {
        const machine = await this.findOne(id);

        await this.machineRepository.remove(machine);
    }
}
