export class SendMailRequestDto {
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  templateId: string;
  dynamicTemplateData?: Record<string, string>;
}
