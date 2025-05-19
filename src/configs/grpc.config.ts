import { GrpcOptions, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { join } from 'path';

export const grpcOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    // maxReceiveMessageLength: 100 * 1024 * 1024, // 100MB
    // maxSendMessageLength: 100 * 1024 * 1024, // 100MB
    package: ['auth.user.v1'],
    protoPath: ['auth/user/v1/user.proto'],
    url: `${process.env.HOST}:${process.env.GRPC_PORT}`,
    loader: {
      keepCase: false,
      includeDirs: [join(__dirname, '../..', 'src/shared/grpc/protos')],
    },
    keepalive: {
      // Follow suggestion from https://github.com/grpc/grpc-node/issues/1994#issuecomment-1511503166
      // Send keepalive pings every 10 seconds, default is 2 hours.
      keepaliveTimeMs: 10 * 1000,
      // Keepalive ping timeout after 5 seconds, default is 20 seconds.
      keepaliveTimeoutMs: 5 * 1000,
      // Allow keepalive pings when there are no gRPC calls.
      keepalivePermitWithoutCalls: 1,
    },
  },
};
