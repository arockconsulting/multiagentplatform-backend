```typescript
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface EmailData {
  to: string;
  subject: string;
  template: string;
  context: any;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  /**
   * Adds an email to the queue for processing.
   * @param {EmailData} data - The email data.
   * @returns {Promise<void>}
   */
  async addEmailToQueue(data: EmailData): Promise<void> {
    try {
      await this.emailQueue.add('sendEmail', data);
      this.logger.log(`Email added to queue for: ${data.to}`);
    } catch (error) {
      this.logger.error(`Failed to add email to queue: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Sends an email using a template.
   * @param {EmailData} data - The email data.
   * @returns {Promise<void>}
   */
  async sendEmail(data: EmailData): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: data.to,
        subject: data.subject,
        template: data.template,
        context: data.context,
      });
      this.logger.log(`Email sent successfully to: ${data.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${data.to}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```