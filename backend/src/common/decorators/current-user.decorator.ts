import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//Pega o usuario autenticado que foi colocado em request.user pela JwtStrategy
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);