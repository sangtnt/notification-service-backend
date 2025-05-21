import { DataSource } from 'typeorm';
import 'dotenv/config';
import { join } from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.AUTH_DB_HOST || 'localhost',
  port: parseInt(process.env.AUTH_DB_PORT || '5432', 10),
  username: process.env.AUTH_DB_USERNAME,
  password: process.env.AUTH_DB_PASSWORD,
  database: process.env.AUTH_DB_DATABASE,
  schema: process.env.AUTH_DB_SCHEMA,
  synchronize: false,
  logging: process.env.AUTH_DB_LOGGING === 'true',
  migrationsRun: false,
  migrationsTableName: 'migrations',
  migrations: [join(__dirname, '..', 'infra/databases/typeorm/auth-db/migrations/*{.ts,.js}')],
  entities: [join(__dirname, '..', 'infra/databases/typeorm/auth-db/entities/*{.ts,.js}')],
});
