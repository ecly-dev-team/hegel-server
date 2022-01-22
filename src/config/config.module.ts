import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';

@Module({
  providers: [ConfigService],
  controllers: [ConfigController],
})
export class ConfigModule {}
