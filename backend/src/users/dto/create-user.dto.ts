import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID, MinLength, } from "class-validator";
import { Role } from '../../common/enums/role.enum'

export class CreateUserDto {
    @IsNotEmpty({message: 'O nome é Obrigatório.'})
    @IsString({message: 'O nome deve ser em texto.'})
    name: string;

    @IsNotEmpty({message: 'O email é Obrigatório.'})
    @IsEmail({}, {message: 'Informe um e-mail válido.'})
    email: string;

    @IsNotEmpty({message: 'A senha é Obrigatória.'})
    @IsString({message: 'A senha deve ser em formato de texto.'})
    @MinLength(6, {message: 'A senha deve ter no mínimo 6 caracteres.'})
    password: string;

    @IsNotEmpty({message: 'Role e obrigatório'})
    @IsEnum(Role, {message: 'Role deve ser ADMIN ou USER'})
    role: Role;

    @IsNotEmpty({message: 'A empresa é obrigatória.'})
    @IsUUID('4', {message: 'O companyId deve ser um UUID válido'})
    companyId: string;
}