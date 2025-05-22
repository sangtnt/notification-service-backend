import { Module } from '@nestjs/common';
import { NOTIFICATION_DATA_SOURCE_NAME } from '@/shared/constants/data-source-name.constant';
import { TypeOrmModule } from '@nestjs/typeorm';
import { optionsFactory } from '@/shared/utils/database-factory.util';
import { DataSource } from 'typeorm';
import { notificationDatabaseConfigOptions } from '@/configs/notification-database.config';
import { ConfigService } from '@nestjs/config';

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
  exports: ['DATA_SOURCE'],
})
export class InfrastructureModule {}
