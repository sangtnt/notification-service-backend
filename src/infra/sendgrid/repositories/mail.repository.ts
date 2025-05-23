import { RpcException } from '@/core/exceptions/rpc.exception';
import { ErrorCodes } from '@/shared/constants/rp-exception.constant';
import { ConfigService } from '@nestjs/config';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { IMailRepository } from '@/core/repositories/mail.repository';
import * as sgMail from '@sendgrid/mail';
import { Logger } from '@/shared/logger/services/app-logger.service';
import { Inject, Injectable } from '@nestjs/common';
import { SendMailRequestDto } from '@/application/mail/dtos/mail.dto';

@Injectable()
export class MailRepository implements IMailRepository {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    const apiKey = this.configService.get<string>('SEND_GRID_API_KEY');
    if (!apiKey) {
      throw new RpcException({
        error: ErrorCodes.INTERNAL_SERVER_ERROR,
        code: GrpcStatus.INTERNAL,
      });
    }
    sgMail.setApiKey(apiKey);
  }

  async sendMail(req: SendMailRequestDto): Promise<void> {
    try {
      const emailFrom = this.configService.get<string>('SEND_GRID_FROM_EMAIL');
      if (!emailFrom) {
        throw new RpcException({
          error: ErrorCodes.INTERNAL_SERVER_ERROR,
          code: GrpcStatus.INTERNAL,
        });
      }
      const result = await sgMail.send({ ...req, from: emailFrom });
      this.logger.log(`SendGrid response: ${JSON.stringify(result)}`);
    } catch (error) {
      this.logger.error(`Error sending email with SendGrid: ${JSON.stringify(error)}`);
    }
  }
}
