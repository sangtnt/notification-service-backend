import { SendMailRequestDto } from '@/application/mail/dtos/mail.dto';
import { SendMailUseCase } from '@/application/mail/usecases/send-mail.usecase';
import { Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

export class MailController {
  constructor(@Inject() private readonly sendMailUseCase: SendMailUseCase) {}

  @GrpcMethod('MailService', 'SendMail')
  async sendMail(req: SendMailRequestDto): Promise<void> {
    await this.sendMailUseCase.execute(req);
  }
}
