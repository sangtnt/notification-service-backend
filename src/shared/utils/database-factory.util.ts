import { authDatabaseConfigOptions } from '@/configs/auth-database.config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const optionsFactory = (dataSource: string): TypeOrmModuleOptions => {
  switch (dataSource) {
    case 'auth':
      return authDatabaseConfigOptions;
    default: {
      throw new Error(`Unknown data source: ${dataSource}`);
    }
  }
};
