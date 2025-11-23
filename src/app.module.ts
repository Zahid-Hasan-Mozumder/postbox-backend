import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FeedModule } from './feed/feed.module';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule, FeedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
