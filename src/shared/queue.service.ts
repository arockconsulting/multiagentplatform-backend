```typescript
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface EmailJobData {
  to: string;
  subject: string;
  body: string;
}

/**
 * Serviço para adicionar tarefas à fila de e-mail.
 */
@Injectable()
export class QueueService {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  /**
   * Adiciona um trabalho de envio de e-mail à fila.
   *
   * @param {EmailJobData} data Os dados do e-mail a serem enviados.
   * @returns {Promise<void>}
   */
  async addEmailToQueue(data: EmailJobData): Promise<void> {
    await this.emailQueue.add('send-email', data, {
      attempts: 3, // Tenta enviar o e-mail até 3 vezes
      backoff: {
        type: 'exponential',
        delay: 1000, // Começa com 1 segundo e aumenta exponencialmente
      },
    });
  }
}
```