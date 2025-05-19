import { DataSource } from 'typeorm';
import { authDatabaseConfigOptions } from '@/configs/auth-database.config';

export const AppDataSource = new DataSource(authDatabaseConfigOptions);
