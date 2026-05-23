import { Module } from '@nestjs/common';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machine } from './machine.entity';
import { Company } from '../companies/company.entity'


@Module({
  imports: [TypeOrmModule.forFeature([Machine, Company])],
  controllers: [MachinesController],
  providers: [MachinesService]
})
export class MachinesModule {}
