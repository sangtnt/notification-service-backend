import { LogLevel } from '@/shared/constants/rp-exception.constant';
import { Metadata, status as GrpcStatus } from '@grpc/grpc-js';
import { RpcException as NestJsRpcException } from '@nestjs/microservices';

interface IRpcException {
  code: string;
  message: string;
  logLevel: LogLevel;
}

export class RpcException extends NestJsRpcException implements Error {
  metadata?: Metadata;
  code: GrpcStatus;

  constructor({
    error,
    code = GrpcStatus.UNKNOWN,
    metadata,
  }: {
    error: IRpcException;
    code?: GrpcStatus;
    metadata?: Metadata;
  }) {
    super(error);
    this.code = code;
    this.metadata = metadata ?? new Metadata();
  }
}
