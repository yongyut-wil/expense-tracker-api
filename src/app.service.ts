import { Injectable } from '@nestjs/common';

export interface HealthCheckResponse {
  status: string;
  name: string;
  version: string;
  timestamp: string;
}

@Injectable()
export class AppService {
  getHealthCheck(): HealthCheckResponse {
    return {
      status: 'ok',
      name: 'Expense Tracker API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
