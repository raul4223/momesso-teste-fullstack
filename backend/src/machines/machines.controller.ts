import { Controller, Body, Delete, Get, Patch, Param, Post, UseGuards } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('machines')
export class MachinesController {
    constructor(private readonly machinesService: MachinesService) {}

    @Roles(Role.ADMIN)
    @Post()
    create(@Body() createMachineDto: CreateMachineDto) {
        return this.machinesService.create(createMachineDto);
    }

    @Get()
    findAll(@CurrentUser() user: AuthenticatedUser) {
        return this.machinesService.findAll(user);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.machinesService.findOne(id, user);
    }
    
    @Roles(Role.ADMIN)
    @Patch(':id')
    update(@Param('id') id: string,
    @Body() updateMachineDto: UpdateMachineDto) {
        return this.machinesService.update(id, updateMachineDto);
    }

    @Roles(Role.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.machinesService.remove(id);
    }
}
