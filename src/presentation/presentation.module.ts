import { ApplicationModule } from '@/application/application.module';
import { Module } from '@nestjs/common';
import { UserController } from './grpc/user/user.controller';
import { KafkaModule } from '@/infra/kafka/kafka.module';

@Module({
  imports: [ApplicationModule, KafkaModule],
  controllers: [UserController],
})
export class PresentationModule {}
