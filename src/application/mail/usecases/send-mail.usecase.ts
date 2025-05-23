import { IMailRepository } from '@/core/repositories/mail.repository';
import { MAIL_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { Inject, Injectable } from '@nestjs/common';
import { SendMailRequestDto } from '../dtos/mail.dto';

@Injectable()
export class SendMailUseCase {
  constructor(@Inject(MAIL_REPOSITORY_TOKEN) private readonly mailRepository: IMailRepository) {}

  async execute(req: SendMailRequestDto): Promise<void> {
    await this.mailRepository.sendMail(req);
  }
}
