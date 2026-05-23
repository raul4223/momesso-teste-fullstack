import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //ValidationPipe ativa as validacoes dos DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,//remove campos que nao existem no DTO
      forbidNonWhitelisted: true,//retorna erro se o usuario tentar inserir campos que nao deveriam existir
      transform: true,
    }),
  );

  //Ativa a serializacao global, para decorators funcionarem
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
