import { notificationDatabaseConfigOptions } from '@/configs/notification-database.config';
import { NOTIFICATION_DATA_SOURCE_NAME } from '@/shared/constants/data-source-name.constant';
import { optionsFactory } from '@/shared/utils/database-factory.util';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          ...optionsFactory(NOTIFICATION_DATA_SOURCE_NAME, configService),
          name: NOTIFICATION_DATA_SOURCE_NAME,
        };
      },
      inject: [ConfigService],
      name: NOTIFICATION_DATA_SOURCE_NAME,
    }),
  ],
  providers: [
    {
      provide: 'DATA_SOURCE',
      useFactory: (configService: ConfigService): Promise<DataSource> => {
        const dataSource = new DataSource(notificationDatabaseConfigOptions(configService));

        return dataSource.initialize();
      },
      inject: [ConfigService],
    },
  ],
})
export class DatabaseModule {}
