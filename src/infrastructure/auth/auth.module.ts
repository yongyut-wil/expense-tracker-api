import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseModule } from '@infrastructure/database/database.module';

import {
  RegisterUserUseCase,
  LoginUserUseCase,
  GetCurrentUserUseCase,
} from '@application/use-cases/auth';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ||
            '24h') as `${number}${'s' | 'm' | 'h' | 'd'}`,
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
    JwtStrategy,
    // Export use cases for controllers
    RegisterUserUseCase,
    LoginUserUseCase,
    GetCurrentUserUseCase,
  ],
})
export class AuthModule {}
