import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthModule } from '../auth/auth.module';

/**
 * HTTP Auth Module
 * Provides HTTP endpoints for authentication
 */
@Module({
  imports: [AuthModule],
  controllers: [AuthController],
})
export class HttpAuthModule {}
