```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * Entidade que representa um contato.
 */
@Entity('contacts')
export class Contact {
  /**
   * ID único do contato.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Nome do contato.
   * @example "John Doe"
   */
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  /**
   * Email do contato.
   * @example "john.doe@example.com"
   */
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  /**
   * Mensagem do contato.
   * @example "Olá, gostaria de saber mais sobre seus serviços."
   */
  @Column({ type: 'text' })
  @IsNotEmpty()
  @IsString()
  message: string;

  /**
   * Data de criação do contato.
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```