import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfrastructureModule } from './infra/infra.module';
import { PresentationModule } from './presentation/presentation.module';
import { LoggerModule } from './shared/logger/logger.module';
import { getLoggerOptions } from './configs/logger.config';
import appConfig from './configs/app.config';
import authDatabaseConfig from './configs/auth-database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, authDatabaseConfig],
      cache: true,
    }),
    LoggerModule.forRoot(getLoggerOptions()),
    InfrastructureModule,
    PresentationModule,
  ],
})
export class AppModule {}
