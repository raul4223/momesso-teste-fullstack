import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '../common/enums/role.enum';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            //de onde o token sera extraido
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,//tokens expirados sao rejeitados
            secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
        });
    }
    //so e executado quando o token e valido
    async validate(payload: {
        sub: string;
        email: string;
        role: Role;
        companyId: string;
        comapanyId?: string;
    }): Promise<AuthenticatedUser> {
        return {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            companyId: payload.companyId ?? payload.comapanyId,
        }
    }
}
