import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//protecao de rota: usa o JwtStrategy para validar se o usuario enviou um token valido
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}