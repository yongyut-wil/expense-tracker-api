import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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
