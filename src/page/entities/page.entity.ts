```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Enum que representa o status de uma página.
 */
export enum PageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

/**
 * Entidade que representa uma página no sistema.
 *
 * @Entity page
 */
@Entity('page')
export class Page {
  /**
   * ID da página (gerado automaticamente).
   *
   * @PrimaryGeneratedColumn uuid
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Título da página.
   *
   * @Column varchar
   * @IsString
   * @IsNotEmpty
   * @MaxLength(255)
   */
  @Column({ type: 'varchar', length: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  /**
   * Slug da página (usado na URL).
   *
   * @Column varchar
   * @IsString
   * @IsNotEmpty
   * @MaxLength(255)
   */
  @Column({ type: 'varchar', length: 255, unique: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  /**
   * Conteúdo da página.
   *
   * @Column text
   * @IsString
   * @IsOptional
   */
  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  content: string;

  /**
   * Status da página (draft, published, archived).
   *
   * @Column enum
   * @IsEnum PageStatus
   * @IsNotEmpty
   */
  @Column({
    type: 'enum',
    enum: PageStatus,
    default: PageStatus.DRAFT,
  })
  @IsEnum(PageStatus)
  @IsNotEmpty()
  status: PageStatus;

  /**
   * Data de criação da página.
   *
   * @CreateDateColumn
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Data da última atualização da página.
   *
   * @UpdateDateColumn
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
```