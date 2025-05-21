import { authDatabaseConfigOptions } from '@/configs/auth-database.config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const optionsFactory = (
  dataSource: string,
  configService: ConfigService,
): TypeOrmModuleOptions => {
  switch (dataSource) {
    case 'auth':
      return authDatabaseConfigOptions(configService);
    default: {
      throw new Error(`Unknown data source: ${dataSource}`);
    }
  }
};
