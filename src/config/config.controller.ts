import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ConfigService } from './config.service';
import { UpdateConfigDto } from './dto/update-config.dto';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}
  @Get()
  getConfig() {
    return this.configService.getConfig();
  }

  @Patch()
  updateConfig(@Body() updateConfigDto: UpdateConfigDto) {
    return this.configService.updateConfig(updateConfigDto);
  }
}
