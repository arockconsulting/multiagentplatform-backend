```typescript
// src/migrations/create-page.ts

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/**
 * Migration responsável por criar a tabela `page`.
 */
export class CreatePageTable implements MigrationInterface {
  /**
   * Executa a migration, criando a tabela `page`.
   * @param queryRunner O QueryRunner utilizado para executar as queries.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'page',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['draft', 'published', 'archived'],
            default: "'draft'",
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  /**
   * Reverte a migration, removendo a tabela `page`.
   * @param queryRunner O QueryRunner utilizado para executar as queries.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('page');
  }
}
```
```typescript
// src/entities/page.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
} from 'typeorm';
import { IsNotEmpty, IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';

/**
 * Enum que define os status possíveis para uma página.
 */
export enum PageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

/**
 * Entidade que representa uma página no sistema.
 */
@Entity('page')
export class Page {
  /**
   * Identificador único da página.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Título da página.
   * @example 'Página Inicial'
   */
  @IsNotEmpty({ message: 'O título não pode estar vazio.' })
  @IsString({ message: 'O título deve ser uma string.' })
  @MaxLength(255, { message: 'O título não pode ter mais de 255 caracteres.' })
  @Column({ length: 255 })
  title: string;

  /**
   * Slug da página (usado na URL).
   * @example 'pagina-inicial'
   */
  @IsNotEmpty({ message: 'O slug não pode estar vazio.' })
  @IsString({ message: 'O slug deve ser uma string.' })
  @MaxLength(255, { message: 'O slug não pode ter mais de 255 caracteres.' })
  @Column({ length: 255, unique: true })
  slug: string;

  /**
   * Conteúdo da página.
   */
  @IsOptional()
  @Column({ type: 'text', nullable: true })
  content: string;

  /**
   * Status da página (rascunho, publicada, arquivada).
   */
  @IsNotEmpty({ message: 'O status não pode estar vazio.' })
  @IsEnum(PageStatus, { message: 'O status deve ser um valor válido.' })
  @Column({ type: 'enum', enum: PageStatus, default: PageStatus.DRAFT })
  status: PageStatus;

  /**
   * Data de criação da página.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Data da última atualização da página.
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Método executado antes de cada atualização da entidade.
   * Garante que o campo `updatedAt` seja atualizado.
   */
  @BeforeUpdate()
  updateTimestamps(): void {
    this.updatedAt = new Date();
  }
}
```
