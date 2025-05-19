import DatabaseLogger from '@/shared/utils/database-logger.util';
import 'dotenv/config';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

export const authDatabaseConfigOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.AUTH_DB_HOST || 'localhost',
  port: parseInt(process.env.AUTH_DB_PORT || '5432', 10),
  username: process.env.AUTH_DB_USERNAME,
  password: process.env.AUTH_DB_PASSWORD,
  database: process.env.AUTH_DB_DATABASE,
  schema: process.env.AUTH_DB_SCHEMA,
  synchronize: false,
  logging: process.env.AUTH_DB_LOGGING === 'true',
  entities: [join(__dirname, '..', 'infra/databases/typeorm/auth-db/entities/*{.ts,.js}')],
  migrations: [join(__dirname, '..', 'infra/databases/typeorm/auth-db/migrations/*{.ts,.js}')],
  migrationsRun: false,
  migrationsTableName: 'migrations',
  logger: new DatabaseLogger(),
};
