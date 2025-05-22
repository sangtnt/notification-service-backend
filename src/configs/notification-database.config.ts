import { notificationDatabaseConfig } from '@/shared/constants/config.constants';
import DatabaseLoggerService from '@/shared/logger/services/database-logger.service';
import { ConfigService, registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

export const notificationDatabaseConfigOptions = (
  configService: ConfigService,
): DataSourceOptions => {
  const configs = configService.get(notificationDatabaseConfig) as DataSourceOptions;
  return {
    ...configs,
    entities: [
      join(__dirname, '..', 'infra/databases/typeorm/notification-db/entities/*{.ts,.js}'),
    ],
    logger: new DatabaseLoggerService(),
  };
};

export default registerAs(
  notificationDatabaseConfig,
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.NOTIFICATION_DB_HOST || 'localhost',
    port: parseInt(process.env.NOTIFICATION_DB_PORT || '5432', 10),
    username: process.env.NOTIFICATION_DB_USERNAME,
    password: process.env.NOTIFICATION_DB_PASSWORD,
    database: process.env.NOTIFICATION_DB_DATABASE,
    schema: process.env.NOTIFICATION_DB_SCHEMA,
    synchronize: false,
    logging: process.env.NOTIFICATION_DB_LOGGING === 'true',
  }),
);
