import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseModule } from '@infrastructure/database/database.module';

// Import use cases
import {
  RegisterUserUseCase,
  LoginUserUseCase,
  GetCurrentUserUseCase,
} from '@application/use-cases/auth';

/**
 * Auth Module
 * Handles authentication functionality
 */
@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ||
            '24h') as any,
        },
      }),
    }),
  ],
  providers: [
    // Strategies
    JwtStrategy,
    // Use Cases
    RegisterUserUseCase,
    LoginUserUseCase,
    GetCurrentUserUseCase,
  ],
  exports: [
    JwtModule,
    PassportModule,
    // Export use cases for controllers
    RegisterUserUseCase,
    LoginUserUseCase,
    GetCurrentUserUseCase,
  ],
})
export class AuthModule {}
