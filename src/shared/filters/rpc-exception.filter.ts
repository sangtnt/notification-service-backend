/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentsHost, BadRequestException, Catch, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException as NestJsRpcException } from '@nestjs/microservices';
import { RpcException } from '@/core/exceptions/rpc.exception';
import { TRACE_ID_HEADER } from '@/shared/constants/constants';
import { Observable } from 'rxjs';
import { status as GrpcStatus } from '@grpc/grpc-js';

@Catch(RpcException)
export class DefaultRpcExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const logger = new Logger(DefaultRpcExceptionFilter.name);
    logger.error(`Error in gRPC: ${JSON.stringify(exception)}`);
    const ctx = host.switchToRpc().getContext<{ get: (str) => [string] }>();
    exception.metadata?.add(TRACE_ID_HEADER, ctx.get(TRACE_ID_HEADER)[0]);

    return super.catch(
      new NestJsRpcException({
        code: exception.code,
        message: JSON.stringify(exception.getError()),
        metadata: exception.metadata,
      }),
      host,
    );
  }
}

@Catch(BadRequestException)
export class CatchValidationFilter extends BaseRpcExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost): Observable<any> {
    const logger = new Logger(CatchValidationFilter.name);
    logger.error(`Error in gRPC: ${JSON.stringify(exception)}`);
    return super.catch(
      new NestJsRpcException({
        code: GrpcStatus.INVALID_ARGUMENT,
        message: JSON.stringify(exception),
      }),
      host,
    );
  }
}

@Catch()
export class CatchEverythingFilter extends BaseRpcExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): Observable<any> {
    const logger = new Logger(CatchEverythingFilter.name);
    logger.error(`Error in gRPC: ${JSON.stringify(exception)}`);
    return super.catch(
      new NestJsRpcException({
        code: GrpcStatus.UNKNOWN,
        message: 'INTERNAL SERVER ERROR',
      }),
      host,
    );
  }
}
