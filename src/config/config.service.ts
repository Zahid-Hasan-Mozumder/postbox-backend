import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get<T = any>(key: string): T {
    return this.configService.get<T>(key)!;
  }

  get port(): number {
    return this.get<number>('PORT');
  }

  get databaseUrl(): string {
    return this.get<string>('DATABASE_URL');
  }

  get jwtSecret(): string {
    return this.get<string>('JWT_SECRET');
  }
}
