```typescript
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly maxRetries: number;
  private readonly retryDelay: number;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.maxRetries = this.configService.get<number>('EMAIL_MAX_RETRIES') || 3;
    this.retryDelay = this.configService.get<number>('EMAIL_RETRY_DELAY') || 1000; // 1 second
  }

  /**
   * Sends an email with retry mechanism.
   * @param {string} to - Recipient email address.
   * @param {string} subject - Email subject.
   * @param {string} template - Name of the email template.
   * @param {Record<string, any>} context - Data to be passed to the template.
   * @param {number} attempt - Current attempt number (used for recursion).
   * @returns {Promise<boolean>} - True if the email was sent successfully, false otherwise.
   */
  async sendEmailWithRetry(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any>,
    attempt: number = 1,
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: to,
        subject: subject,
        template: template,
        context: context,
      });

      this.logger.log(`Email sent successfully to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to} (Attempt ${attempt}): ${error.message}`,
        error.stack,
      );

      if (attempt <= this.maxRetries) {
        this.logger.log(
          `Retrying email to ${to} in ${this.retryDelay}ms (Attempt ${
            attempt + 1
          }/${this.maxRetries})`,
        );
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        return this.sendEmailWithRetry(to, subject, template, context, attempt + 1);
      } else {
        this.logger.error(
          `Failed to send email to ${to} after ${this.maxRetries} attempts.`,
        );
        return false;
      }
    }
  }

  /**
   * Sends a contact email.
   * @param {string} to - Recipient email address.
   * @param {string} subject - Email subject.
   * @param {Record<string, any>} context - Data to be passed to the template.
   * @returns {Promise<boolean>} - True if the email was sent successfully, false otherwise.
   */
  async sendContactEmail(
    to: string,
    subject: string,
    context: Record<string, any>,
  ): Promise<boolean> {
    return this.sendEmailWithRetry(to, subject, 'contact', context);
  }
}
```