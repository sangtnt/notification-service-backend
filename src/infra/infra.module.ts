import { Module } from '@nestjs/common';
import { AUTH_DATA_SOURCE_NAME } from '@/shared/constants/data-source-name.constant';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { UserRepository } from './databases/typeorm/auth-db/repositories/user.repository';
import { optionsFactory } from '@/shared/utils/database-factory.util';
import { DataSource } from 'typeorm';
import { authDatabaseConfigOptions } from '@/configs/auth-database.config';
import { UserSchema } from './databases/typeorm/auth-db/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...optionsFactory(AUTH_DATA_SOURCE_NAME),
      name: AUTH_DATA_SOURCE_NAME,
    }),
  ],
  providers: [
    {
      provide: 'DATA_SOURCE',
      useFactory: (): Promise<DataSource> => {
        const dataSource = new DataSource(authDatabaseConfigOptions);

        return dataSource.initialize();
      },
    },
    {
      provide: USER_REPOSITORY_TOKEN,
      useFactory: (dataSource: DataSource): UserRepository =>
        new UserRepository(dataSource.getRepository(UserSchema)),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [USER_REPOSITORY_TOKEN, 'DATA_SOURCE'],
})
export class InfrastructureModule {}
