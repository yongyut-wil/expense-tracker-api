import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'อีเมล' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'รหัสผ่าน' })
  password: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'ชื่อผู้ใช้' })
  name?: string;
}
