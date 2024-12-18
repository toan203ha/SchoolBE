import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigModule } from '@nestjs/config';
// import { RolesGuard } from './auth/roles.guard';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //   app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  //   app.useGlobalGuards(new RolesGuard(new Reflector()));
  ConfigModule.forRoot();
  await app.listen(3000);
}
bootstrap();
