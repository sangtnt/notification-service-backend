/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException as NestJsRpcException } from '@nestjs/microservices';
import { RpcException } from '@/core/exceptions/rpc.exception';
import { TRACE_ID_HEADER } from '@/shared/constants/constants';
import { Observable } from 'rxjs';
import { status as GrpcStatus } from '@grpc/grpc-js';

@Catch(RpcException)
export class DefaultRpcExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
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

@Catch()
export class CatchEverythingFilter extends BaseRpcExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): Observable<any> {
    return super.catch(
      new NestJsRpcException({
        code: GrpcStatus.UNKNOWN,
        message: 'INTERNAL SERVER ERROR',
      }),
      host,
    );
  }
}
