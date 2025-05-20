/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Metadata } from '@grpc/grpc-js';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { RpcArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isSilentRequestLog } from '../decorators/silent-request-log.decorators';
import { isSilentResponseLog } from '../decorators/silent-response-log.decorators';
import { transformGrpcRequest } from '../utils/request.transformer';
import { transformGrpcResponseBody } from '../utils/response.transformer';
import { serializeGrpcResponse } from '../utils/serializers.utils';

@Injectable()
export class GrpcRequestLoggingInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger(GrpcRequestLoggingInterceptor.name);

  constructor(
    private readonly cls: ClsService,
    private readonly reflector: Reflector,
  ) {}

  public intercept(context: ExecutionContext, call$: CallHandler): Observable<unknown> {
    const requestType = this.cls.get('requestType');

    if (requestType === 'GRPC') {
      if (!isSilentRequestLog(this.reflector, context)) {
        this.logRequest(context);
      }

      return call$.handle().pipe(
        tap({
          next: (val: unknown): void => {
            if (!isSilentResponseLog(this.reflector, context)) {
              this.logResponse(val, context);
            }
          },
          error: (err: Error): void => {
            this.logError(err, context);
          },
        }),
      );
    }

    return call$.handle();
  }

  private logRequest(context: ExecutionContext): void {
    const rpcContext: RpcArgumentsHost = context.switchToRpc();
    const data = rpcContext.getData();
    const metadata = rpcContext.getContext().metadata;

    this.logger.log({
      message: `[gRPC] Incoming request - ${rpcContext.getData().constructor.name}`,
      request: transformGrpcRequest(this.reflector, context, data, metadata),
    });
  }

  private logResponse(body: any, context: ExecutionContext): void {
    const rpcContext: RpcArgumentsHost = context.switchToRpc();
    const metadata = context?.getArgs()[1] as Metadata;
    const meta = {
      response: serializeGrpcResponse(body),
      body: transformGrpcResponseBody(this.reflector, context, body),
      metadata,
    };

    this.logger.log({
      message: `[gRPC] Outgoing response - ${rpcContext.getData().constructor.name}`,
      ...meta,
    });
  }

  private logError(error: Error, context: ExecutionContext): void {
    const rpcContext: RpcArgumentsHost = context.switchToRpc();
    const metadata = rpcContext.getContext().metadata;

    this.logger.error({
      message: `[gRPC] Error response - ${rpcContext.getData().constructor.name}`,
      error: error.message,
      stack: error.stack,
      metadata,
    });
  }
}
