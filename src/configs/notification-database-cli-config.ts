import { DataSource } from 'typeorm';
import 'dotenv/config';
import { join } from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.NOTIFICATION_DB_HOST || 'localhost',
  port: parseInt(process.env.NOTIFICATION_DB_PORT || '5432', 10),
  username: process.env.NOTIFICATION_DB_USERNAME,
  password: process.env.NOTIFICATION_DB_PASSWORD,
  database: process.env.NOTIFICATION_DB_DATABASE,
  schema: process.env.NOTIFICATION_DB_SCHEMA,
  synchronize: false,
  logging: process.env.NOTIFICATION_DB_LOGGING === 'true',
  migrationsRun: false,
  migrationsTableName: 'migrations',
  migrations: [
    join(__dirname, '..', 'infra/databases/typeorm/notification-db/migrations/*{.ts,.js}'),
  ],
  entities: [join(__dirname, '..', 'infra/databases/typeorm/notification-db/entities/*{.ts,.js}')],
});
