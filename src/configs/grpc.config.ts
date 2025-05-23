import { GrpcOptions, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { join } from 'path';

export const grpcOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['notification.mail.v1'],
    protoPath: ['notification/mail/v1/mail.proto'],
    url: `${process.env.HOST}:${process.env.GRPC_PORT}`,
    loader: {
      keepCase: false,
      includeDirs: [join(__dirname, '../..', 'src/shared/grpc/protos')],
    },
    keepalive: {
      keepaliveTimeMs: 10 * 1000,
      keepaliveTimeoutMs: 5 * 1000,
      keepalivePermitWithoutCalls: 1,
    },
  },
};
