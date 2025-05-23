import { SendMailRequestDto } from '@/application/mail/dtos/mail.dto';

export interface IMailRepository {
  sendMail(req: SendMailRequestDto): Promise<void>;
}
