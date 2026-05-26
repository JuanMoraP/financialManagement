import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerGlobal } from './middlewares/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(LoggerGlobal);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`Aplicación corriendo en puerto ${port}`);
}
bootstrap();
