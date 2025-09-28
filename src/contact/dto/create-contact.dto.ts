```typescript
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) para criar um novo contato.
 * Define a estrutura de dados esperada para receber informações de contato.
 */
export class CreateContactDto {
  /**
   * Nome do contato.
   * @example John Doe
   */
  @ApiProperty({ example: 'John Doe', description: 'Nome completo do contato.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  /**
   * Email do contato.
   * @example john.doe@example.com
   */
  @ApiProperty({ example: 'john.doe@example.com', description: 'Endereço de email do contato.' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  /**
   * Assunto da mensagem.
   * @example Feedback sobre o produto
   */
  @ApiProperty({ example: 'Feedback sobre o produto', description: 'Assunto da mensagem.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  subject: string;

  /**
   * Mensagem do contato.
   * @example Gostaria de dar um feedback sobre o seu produto...
   */
  @ApiProperty({ example: 'Gostaria de dar um feedback sobre o seu produto...', description: 'Corpo da mensagem.' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
```