import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: any) {
    // 1. ค้นหา User จาก Email
    console.log('loginDto:', loginDto);
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); // ไม่บอกว่า User ผิด หรือ Pass ผิด เพื่อความปลอดภัย
    }

    // 2. เอารหัสผ่านที่ส่งมา เทียบกับ Hash ใน DB
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. ถ้าผ่าน ให้สร้าง Payload (ข้อมูลที่จะฝังใน Token)
    const payload = { sub: user.id, email: user.email };

    // 4. สร้าง Token และส่งกลับ
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: any) {
    // 1. เช็คก่อนว่า Email ซ้ำไหม
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // 2. Hash Password (ความยาก 10 rounds)
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      saltOrRounds,
    );

    // 3. สร้าง User ใหม่โดยใช้ Password ที่ Hash แล้ว
    const newUser = await this.usersService.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword, // สำคัญมาก!
    });

    // 4. ลบ password ออกจาก object ก่อนส่งกลับ (เพื่อความปลอดภัย)
    const { password, ...result } = newUser;
    return result;
  }
}
