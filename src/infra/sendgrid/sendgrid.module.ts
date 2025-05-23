import { MAIL_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { Module } from '@nestjs/common';
import { MailRepository } from './repositories/mail.repository';

@Module({
  providers: [
    {
      provide: MAIL_REPOSITORY_TOKEN,
      useClass: MailRepository,
    },
  ],
  exports: [MAIL_REPOSITORY_TOKEN],
})
export class SendGridModule {}
