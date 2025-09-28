```typescript
import { Injectable, HttpService, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Serviço para verificar o reCAPTCHA v3.
 */
@Injectable()
export class RecaptchaService {
  private readonly recaptchaSecret: string;
  private readonly recaptchaVerifyUrl: string = 'https://www.google.com/recaptcha/api/siteverify';
  private readonly logger = new Logger(RecaptchaService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.recaptchaSecret = this.configService.get<string>('RECAPTCHA_SECRET_KEY') || '';
    if (!this.recaptchaSecret) {
      this.logger.warn('Chave secreta do reCAPTCHA não configurada. A verificação do reCAPTCHA sempre falhará.');
    }
  }

  /**
   * Verifica o token reCAPTCHA fornecido com o Google reCAPTCHA API.
   * @param recaptchaToken O token reCAPTCHA a ser verificado.
   * @returns Um Observable contendo um booleano indicando se a verificação foi bem-sucedida.
   */
  verify(recaptchaToken: string): Observable<boolean> {
    if (!this.recaptchaSecret) {
      this.logger.warn('Chave secreta do reCAPTCHA não configurada. Retornando falso.');
      return of(false);
    }

    const params = new URLSearchParams();
    params.append('secret', this.recaptchaSecret);
    params.append('response', recaptchaToken);

    return this.httpService.post(this.recaptchaVerifyUrl, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).pipe(
      map((response: AxiosResponse<RecaptchaResponse>) => {
        if (response.data.success) {
          this.logger.debug('Verificação reCAPTCHA bem-sucedida.');
          return true;
        } else {
          this.logger.warn(`Verificação reCAPTCHA falhou. Erros: ${JSON.stringify(response.data['error-codes'])}`);
          return false;
        }
      }),
      catchError(error => {
        this.logger.error(`Erro ao verificar reCAPTCHA: ${error.message}`, error.stack);
        return of(false);
      }),
    );
  }
}

/**
 * Interface representando a resposta da API reCAPTCHA.
 */
interface RecaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}
```