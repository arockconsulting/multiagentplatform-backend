```typescript
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) para criar um novo contato.
 * Define a estrutura de dados esperada para a criação de um contato
 * e inclui regras de validação para garantir a integridade dos dados.
 */
export class CreateContactDto {
  /**
   * Nome do contato.
   * @example "João da Silva"
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  /**
   * Endereço de e-mail do contato.
   * Deve ser um endereço de e-mail válido.
   * @example "joao.silva@example.com"
   */
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  /**
   * Número de telefone do contato.
   * Deve ser um número de telefone válido.
   * @example "+5511999999999"
   */
  @IsPhoneNumber('BR')
  @IsNotEmpty()
  phone: string;

  /**
   * Mensagem opcional do contato.
   * @example "Gostaria de saber mais sobre seus serviços."
   */
  @IsString()
  @IsOptional()
  @MaxLength(500)
  message?: string;
}
```