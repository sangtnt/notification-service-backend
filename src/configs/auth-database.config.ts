import { authDatabaseConfig } from '@/shared/constants/config.constants';
import DatabaseLoggerService from '@/shared/logger/services/database-logger.service';
import { ConfigService, registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

export const authDatabaseConfigOptions = (configService: ConfigService): DataSourceOptions => {
  const configs = configService.get(authDatabaseConfig) as DataSourceOptions;
  return {
    ...configs,
    entities: [join(__dirname, '..', 'infra/databases/typeorm/auth-db/entities/*{.ts,.js}')],
    logger: new DatabaseLoggerService(),
  };
};

export default registerAs(
  authDatabaseConfig,
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.AUTH_DB_HOST || 'localhost',
    port: parseInt(process.env.AUTH_DB_PORT || '5432', 10),
    username: process.env.AUTH_DB_USERNAME,
    password: process.env.AUTH_DB_PASSWORD,
    database: process.env.AUTH_DB_DATABASE,
    schema: process.env.AUTH_DB_SCHEMA,
    synchronize: false,
    logging: process.env.AUTH_DB_LOGGING === 'true',
  }),
);
