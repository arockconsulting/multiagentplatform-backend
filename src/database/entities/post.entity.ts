```typescript
/**
 * src/database/entities/post.entity.ts
 *
 * Cria entidade Post com campos title, slug, content, createdAt, updatedAt
 */

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeUpdate,
} from 'typeorm';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import slugify from 'slugify';

/**
 * Entidade Post para armazenar artigos no banco de dados.
 */
@Entity('posts')
export class Post {
  /**
   * ID único do post. Gerado automaticamente.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Título do post.
   * @minLength 5
   * @maxLength 200
   */
  @Column({ length: 200 })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  /**
   * Slug do post. Gerado automaticamente a partir do título.
   */
  @Column({ length: 200, unique: true })
  slug: string;

  /**
   * Conteúdo do post.
   */
  @Column({ type: 'text' })
  @IsNotEmpty()
  @IsString()
  content: string;

  /**
   * Data de criação do post.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Data da última atualização do post.
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Hook executado antes de salvar ou atualizar a entidade.
   * Gera o slug a partir do título.
   */
  @BeforeUpdate()
  generateSlug(): void {
    this.slug = slugify(this.title, { lower: true });
  }
}
```