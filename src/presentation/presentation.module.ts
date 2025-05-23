import { ApplicationModule } from '@/application/application.module';
import { Module } from '@nestjs/common';
import { MailController } from './grpc/mail.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [MailController],
})
export class PresentationModule {}
