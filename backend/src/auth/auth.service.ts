import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,

        private readonly jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);

        if(!user) {
            throw new UnauthorizedException('E-mail ou senha inválidos.');
        }

        const passwordMatches = await bcrypt.compare(
            loginDto.password,
            user.password,
        );

        if(!passwordMatches) {
            throw new UnauthorizedException('E-mail ou senha inválidos.');
        }

        //conteudo interno do token
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            companyId: user.companyId
        };

        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId,
            },
        };
    }
}
