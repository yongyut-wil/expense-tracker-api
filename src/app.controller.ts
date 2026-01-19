import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import type { HealthCheckResponse } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health Check', description: 'ตรวจสอบสถานะของ API' })
  getHealthCheck(): HealthCheckResponse {
    return this.appService.getHealthCheck();
  }
}
