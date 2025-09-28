```typescript
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entidade Contact para armazenar informações de contato.
 */
@Entity()
export class Contact {
  /**
   * ID único do contato.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Nome do contato.
   * @example 'John Doe'
   */
  @Column()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  /**
   * Email do contato.
   * @example 'john.doe@example.com'
   */
  @Column()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  /**
   * Mensagem do contato.
   * @example 'Olá, gostaria de saber mais sobre...'
   */
  @Column({ type: 'text' })
  @IsNotEmpty()
  @IsString()
  message: string;

  /**
   * Data de criação do contato.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Data da última atualização do contato.
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
```