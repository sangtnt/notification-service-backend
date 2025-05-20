import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  INestMicroservice,
  Logger,
  LoggerService,
  ShutdownSignal,
  ValidationPipe,
} from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { grpcOptions } from './configs/grpc.config';
import { DefaultRpcExceptionFilter } from './shared/utils/filters/rpc-exception.filter';
import { CustomLoggerService } from './shared/utils/logger/services/custom-logger.service';
import { GrpcRequestLoggingInterceptor } from './shared/utils/logger/interceptors/grpc-request-logging.interceptor';
import { ClsService } from 'nestjs-cls';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, grpcOptions);
  const logger = new Logger('Bootstrap');

  try {
    logAppEnv(logger);
    configure(app);
    logAppPath(logger);
  } catch (error) {
    const stack = error instanceof Error ? error.stack : '';
    logger.error(`Error starting server, ${error}`, stack, 'Bootstrap');
    process.exit();
  }

  await app.listen();
}

function configure(app: INestMicroservice): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const cls = app.get(ClsService);
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new DefaultRpcExceptionFilter());
  app.useLogger(app.get(CustomLoggerService));
  app.useGlobalInterceptors(new GrpcRequestLoggingInterceptor(cls, reflector));

  app.enableShutdownHooks(
    Object.values(ShutdownSignal).filter((x) => x !== ShutdownSignal.SIGUSR2),
  );
}

function logAppPath(logger: LoggerService): void {
  const host = process.env.HOST || 'localhost';
  const grpcPort = process.env.GRPC_PORT || '5000';

  if (process.env.NODE_ENV !== 'production') {
    logger.log(`Server gRPC ready at http://${host}:${grpcPort}`);
  } else {
    logger.log(`Server gRPC is listening on port ${grpcPort}`);
  }
}

function logAppEnv(logger: LoggerService): void {
  logger.log(`Environment: ${process.env['NODE_ENV']?.toUpperCase()}`);
}

void bootstrap();
