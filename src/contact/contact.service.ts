```typescript
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ContactDto } from './dto/contact.dto';
import { ConfigService } from '@nestjs/config';

/**
 * Serviço para lidar com operações relacionadas a contatos, como envio de e-mails.
 */
@Injectable()
export class ContactService {
  private readonly recipientEmail: string;

  /**
   * Construtor da classe ContactService.
   * @param mailerService Serviço de e-mail do NestJS Mailer.
   * @param configService Serviço de configuração do NestJS.
   */
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.recipientEmail = this.configService.get<string>('CONTACT_EMAIL');
    if (!this.recipientEmail) {
      throw new Error(
        'O e-mail do destinatário (CONTACT_EMAIL) não está configurado.',
      );
    }
  }

  /**
   * Envia um e-mail com os dados do contato.
   * @param contactDto DTO contendo os dados do contato.
   * @returns Uma Promise que resolve quando o e-mail é enviado com sucesso.
   * @throws Error se o envio do e-mail falhar.
   */
  async sendContactEmail(contactDto: ContactDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: this.recipientEmail,
        subject: `Novo contato de: ${contactDto.name}`,
        template: 'contact', // O nome do template Handlebars
        context: {
          name: contactDto.name,
          email: contactDto.email,
          message: contactDto.message,
          phone: contactDto.phone,
        },
      });
    } catch (error) {
      console.error('Erro ao enviar o e-mail de contato:', error);
      throw new Error('Falha ao enviar o e-mail de contato.');
    }
  }
}
```