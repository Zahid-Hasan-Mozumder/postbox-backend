import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get port(): number {
    return this.configService.get<number>('port')!;
  }

  get databaseUrl(): string {
    return this.configService.get<string>('database.url')!;
  }
}
