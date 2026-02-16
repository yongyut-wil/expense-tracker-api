import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    DatabaseModule,
    HttpAuthModule,
    HttpTransactionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Uncomment after filters and interceptors are properly moved
    // {
    //   provide: APP_FILTER,
    //   useClass: GlobalExceptionFilter,
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ResponseInterceptor,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply logger middleware to all routes
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

