import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  INestApplication,
  Logger,
  LoggerService,
  ShutdownSignal,
  ValidationPipe,
} from '@nestjs/common';
import { DefaultRpcExceptionFilter } from './shared/utils/filters/rpc-exception.filter';
import { AppLoggerService } from './shared/logger/services/app-logger.service';
import { GrpcRequestLoggingInterceptor } from './shared/logger/interceptors/grpc-request-logging.interceptor';
import { ClsService } from 'nestjs-cls';
import { NestExpressApplication } from '@nestjs/platform-express';
import { grpcOptions } from './configs/grpc.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  try {
    logAppEnv(logger);
    configure(app);
    logAppPath(logger);
    await startEvent(app);
  } catch (error) {
    const stack = error instanceof Error ? error.stack : '';
    logger.error(`Error starting server, ${error}`, stack, 'Bootstrap');
    process.exit();
  }
}

async function startEvent(app: INestApplication): Promise<void> {
  app.connectMicroservice(grpcOptions, {
    inheritAppConfig: true,
  });

  await app.startAllMicroservices();
}

function configure(app: INestApplication): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const cls = app.get(ClsService);
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new DefaultRpcExceptionFilter());
  app.useLogger(app.get(AppLoggerService));
  app.useGlobalInterceptors(new GrpcRequestLoggingInterceptor(cls, reflector));

  app.enableShutdownHooks(
    Object.values(ShutdownSignal).filter((x) => x !== ShutdownSignal.SIGUSR2),
  );
}

function logAppPath(logger: LoggerService): void {
  const host = process.env.HOST || 'localhost';
  const grpcPort = process.env.GRPC_PORT || '8000';
  logger.log(`Server gRPC ready at http://${host}:${grpcPort}`);
}

function logAppEnv(logger: LoggerService): void {
  logger.log(`Environment: ${process.env['NODE_ENV']?.toUpperCase()}`);
}

void bootstrap();
