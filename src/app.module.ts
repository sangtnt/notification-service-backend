import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfrastructureModule } from './infra/infra.module';
import { PresentationModule } from './presentation/presentation.module';
import { LoggerModule } from './shared/utils/logger/logger.module';
import { getLoggerOptions } from './configs/logger.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule.forRoot(getLoggerOptions()),
    InfrastructureModule,
    PresentationModule,
  ],
})
export class AppModule {}
