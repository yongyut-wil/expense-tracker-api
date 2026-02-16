import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  RegisterUserUseCase,
  LoginUserUseCase,
  GetCurrentUserUseCase,
} from '@application/use-cases/auth';
import { LoginDto } from '@application/dto/auth/login.dto';
import { RegisterDto } from '@application/dto/auth/register.dto';
import { CurrentUser } from '@infrastructure/http/decorators/current-user.decorator';

/**
 * Auth Controller
 * Handles authentication-related HTTP requests
 */
@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'ลงทะเบียนผู้ใช้ใหม่' })
  async register(@Body() registerDto: RegisterDto) {
    const { user } = await this.registerUserUseCase.execute(registerDto);
    return {
      success: true,
      data: user.toSafeObject(),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'เข้าสู่ระบบ' })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.loginUserUseCase.execute(loginDto);
    return {
      success: true,
      data: result,
    };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ดูข้อมูลผู้ใช้ปัจจุบัน' })
  async getMe(@CurrentUser() currentUser: { userId: number; email: string }) {
    const user = await this.getCurrentUserUseCase.execute(currentUser.userId);
    return {
      success: true,
      data: user.toSafeObject(),
    };
  }
}
