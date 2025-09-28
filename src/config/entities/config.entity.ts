```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * Entidade que representa uma configuração no sistema.
 * Armazena pares de chave-valor para configurações dinâmicas.
 */
@Entity('config')
export class Config {
  /**
   * ID único da configuração (gerado automaticamente).
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Chave da configuração.
   * Deve ser uma string não vazia e com tamanho máximo de 255 caracteres.
   */
  @Column({ length: 255, unique: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  key: string;

  /**
   * Valor da configuração.
   * Deve ser uma string não vazia.
   */
  @Column({ type: 'text' })
  @IsNotEmpty()
  @IsString()
  value: string;
}
```