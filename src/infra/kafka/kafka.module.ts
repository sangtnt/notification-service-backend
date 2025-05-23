import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaRepository } from './repositories/kafka.repository';
import { KAFKA_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
        },
      },
    ]),
  ],
  providers: [
    {
      provide: KAFKA_REPOSITORY_TOKEN,
      useClass: KafkaRepository,
    },
  ],
  exports: [KAFKA_REPOSITORY_TOKEN],
})
export class KafkaModule {}
