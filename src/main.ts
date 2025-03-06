import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { AppConfigType } from './infrastructure/config/config.app-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get<AppConfigType>('CONFIG');

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*', // Разрешить все домены
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Все методы
    allowedHeaders: '*', // Все заголовки
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true, // Если нужны куки/авторизация
  });

  AppService.setupSwaggerDocument(app);
  AppService.removePoweredByHeader(app);
  AppService.setupValidation(app);

  await app.listen(config.PORT);
}

bootstrap();
