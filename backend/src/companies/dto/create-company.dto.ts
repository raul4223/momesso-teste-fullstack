import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCompanyDto {

    //nome em string obrigatorio
    @IsNotEmpty({message: 'O nome da empresa é obrigatório.'})
    @IsString({message: 'O nome da empresa deve ser um texto.'})
    name: string;

    //cnpj em string obrigatorio
    @IsNotEmpty({message: 'O CNPJ é obrigatorio.'})
    @IsString({message: 'O CNPJ seve ser em formato de texto.'})
    @Length(14, 14, {message: ' O CNPJ deve ter exatamente 14 caracteres.'})
    cnpj: string;    
}