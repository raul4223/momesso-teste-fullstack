import { Controller, Body, Param, Post, Get, Patch, Delete, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
//Responsavel pelas rotas HTTP
@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}

    @Roles(Role.ADMIN)
    @Post()
    //O body da requisicao sera validado pelo CreateCompanyDto
    create(@Body() CreateCompanyDto: CreateCompanyDto) {
        return this.companiesService.create(CreateCompanyDto);
    }

    @Get()
    findAll(@CurrentUser() user: AuthenticatedUser) {
        return this.companiesService.findAll(user);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.companiesService.findOne(id, user);
    }

    @Roles(Role.ADMIN)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() UpdateCompanyDto: UpdateCompanyDto,
    ) { return this.companiesService.update(id, UpdateCompanyDto);}

    @Roles(Role.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.companiesService.remove(id);
    }
}
