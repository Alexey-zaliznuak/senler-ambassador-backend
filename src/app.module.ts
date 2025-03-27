import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './infrastructure/exceptionFilters/http-exception.filter';
import { LoggingModule } from './infrastructure/logging/logging.module';
import { RequestIdMiddleware } from './infrastructure/middlewares';
import { RequestLoggerMiddleware } from './infrastructure/logging/request-logger.middleware';
import { ProcessTimeInterceptor } from './infrastructure/interceptors';
import { LoggingInterceptor } from './infrastructure/logging/logging.interceptor';
import { AxiosModule } from './infrastructure/axios/axios.module';
import { ConfigModule } from '@nestjs/config';
import { CustomConfigModule } from './infrastructure/config/config.module';
import { AppConfig } from './infrastructure/config/config.app-config';
import { appConfigValidationSchema } from './infrastructure/config/config.validation-schema';
import { DatabaseModule } from './infrastructure/database/database.module';
import { RewardsController } from './domain/rewards/rewards.controller';
import { RewardsModule } from './domain/rewards/rewards.module';
import { PromoCodesModule } from './domain/promoCodes/promo-codes.module';
import { PrismaNotFoundExceptionFilter } from './infrastructure/exceptionFilters/prisma-not-found.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => AppConfig],
      validationSchema: appConfigValidationSchema,
    }),
    CustomConfigModule.forRoot(),

    RewardsModule,
    PromoCodesModule,

    // Infrastructure
    LoggingModule.forRoot(),
    AxiosModule.forRoot(),
    DatabaseModule.forRoot(),
  ],

  controllers: [AppController, RewardsController],

  providers: [
    AppService,

    { provide: APP_FILTER, useClass: PrismaNotFoundExceptionFilter },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },

    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ProcessTimeInterceptor },
  ],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware, RequestLoggerMiddleware).forRoutes('*');
  }
}
