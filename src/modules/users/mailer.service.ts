import { Resend } from 'resend';
import { config } from '../../app/config';

type MailerMessage = {
  from: string;
  to: string[];
  subject: string;
  replyTo?: string;
  html?: string;
  text: string;
  attachments?: any[];
};

export class MailerService {
  private readonly mailer: Resend;
  constructor() {
    this.mailer = new Resend(config.implementations.resendSMTP.apiKey);
  }

  async sendEmail(options: {
    description?: string;
    html: string;
    subject: string;
    to: string[];
    attachments?: any[];
  }): Promise<any> {
    const { attachments, to, html, subject, description } = options;

    const mailOptions: MailerMessage = {
      from: `${config.datasite.name} <${config.implementations.resendSMTP.email}>`, // sender address
      to,
      subject: subject,
      text: description,
      html: html,
      attachments,
    };

    try {
      const response = await this.mailer.emails.send({ ...mailOptions });
      console.log('response email send ====>', response);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}
