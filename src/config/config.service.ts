import { Injectable } from '@nestjs/common';
import { UpdateConfigDto } from './dto/update-config.dto';
import { Config } from './interface/config.interface';

const defaultConfig: Config = {
  postsPerPage: 3,
};

@Injectable()
export class ConfigService {
  private config: Config = defaultConfig;

  getConfig(): Config {
    return this.config;
  }

  updateConfig(updateConfigDto: UpdateConfigDto) {
    return (this.config = { ...this.config, ...updateConfigDto });
  }
}
