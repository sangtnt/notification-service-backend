import { Module } from '@nestjs/common';
import { SendMailUseCase } from './mail/usecases/send-mail.usecase';
import { SendGridModule } from '@/infra/sendgrid/sendgrid.module';
import { KafkaModule } from '@/infra/kafka/kafka.module';

@Module({
  imports: [SendGridModule, KafkaModule],
  providers: [SendMailUseCase],
  exports: [SendMailUseCase],
})
export class ApplicationModule {}
