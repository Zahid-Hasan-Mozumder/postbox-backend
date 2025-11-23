import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { validationSchema } from './validation.schema';
import { ConfigService } from './config.service';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      validationSchema: validationSchema,
      isGlobal: true, // makes ConfigService available globally
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
