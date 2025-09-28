```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Enum que define os possíveis status de um post.
 */
export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

/**
 * Entidade Post que representa um post no blog.
 */
@Entity('posts')
export class Post {
  /**
   * ID único do post (gerado automaticamente).
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Título do post.
   * @example 'Meu Primeiro Post'
   */
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  /**
   * Slug do post (gerado a partir do título para URLs amigáveis).
   * @example 'meu-primeiro-post'
   */
  @Column({ type: 'varchar', length: 255, unique: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  slug: string;

  /**
   * Conteúdo completo do post (em formato de texto ou HTML).
   */
  @Column({ type: 'text' })
  @IsNotEmpty()
  @IsString()
  content: string;

  /**
   * Um pequeno trecho/resumo do post.
   */
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  excerpt: string | null;

  /**
   * Status atual do post (rascunho, publicado, arquivado).
   * @default PostStatus.DRAFT
   */
  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  /**
   * URL da imagem destacada do post.
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  featuredImage: string | null;

  /**
   * Data de criação do post (gerada automaticamente).
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Data da última atualização do post (gerada automaticamente).
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
```