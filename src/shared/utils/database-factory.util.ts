import { notificationDatabaseConfigOptions } from '@/configs/notification-database.config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const optionsFactory = (
  dataSource: string,
  configService: ConfigService,
): TypeOrmModuleOptions => {
  switch (dataSource) {
    case 'notification':
      return notificationDatabaseConfigOptions(configService);
    default: {
      throw new Error(`Unknown data source: ${dataSource}`);
    }
  }
};
