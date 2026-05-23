import { MethodCallUpgradeData } from './../../../../frontend/node_modules/@angular/cdk/schematics/ng-update/data/method-call-checks.d';
import { IsOptional, IsString, Length } from "class-validator";

export class UpdateCompanyDto {

    @IsOptional()
    @IsString({message: 'O nome da empresa deve ser em texto.'})
    name?: string;

    @IsOptional()
    @IsString({message: 'O CNPJ deve ser em formato de texto.'})
    @Length(14, 14, {message:'O CNPJ deve ter exatamente 14 caracteres.'})
    cnpj: string;
}