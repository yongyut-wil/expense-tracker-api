import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Infrastructure Modules
import { DatabaseModule } from './infrastructure/database/database.module';
import { HttpAuthModule } from './infrastructure/http/http-auth.module';
import { HttpTransactionsModule } from './infrastructure/http/http-transactions.module';

// Import GlobalExceptionFilter and ResponseInterceptor
// Note: Paths will need to be updated based on where these files are
// For now, commenting out until files are properly moved
// import { GlobalExceptionFilter } from './infrastructure/http/filters/http-exception.filter';
// import { ResponseInterceptor } from './infrastructure/http/interceptors/response.interceptor';
import { LoggerMiddleware } from './infrastructure/http/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: (configService.get<number>('THROTTLE_TTL') || 60) * 1000,
          limit: configService.get<number>('THROTTLE_LIMIT') || 20,
        },
      ],
    }),
    DatabaseModule,
    HttpAuthModule,
    HttpTransactionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply logger middleware to all routes
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
