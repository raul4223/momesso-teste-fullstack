import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class UpdateUserDto {
    @IsOptional()
    @IsString({message: 'O nome deve ser em texto.'})
    name?: string;

    @IsOptional()
    @IsEmail({}, {message: 'Informe um e-mail válido.'})
    email?: string;

    @IsOptional()
    @IsString({message: 'A senha deve ser em formato de texto.'})
    @MinLength(6, {message: 'A senha deve ter no mínimo 6 caracteres.'})
    password?: string;

    @IsOptional()
    @IsEnum(Role, {message: 'Role deve ser ADMIN ou USER'})
    role?: Role;

    @IsOptional()
    @IsUUID('4', {message: 'O companyId deve ser um UUID válido'})
    companyId?: string;
}