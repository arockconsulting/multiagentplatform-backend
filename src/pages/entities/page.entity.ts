```typescript
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Enumeração representando os possíveis status de uma página.
 */
export enum PageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

/**
 * Entidade que representa uma página no sistema.
 * Contém informações como título, slug, conteúdo e status.
 */
@Entity('pages')
export class PageEntity {
  /**
   * Identificador único da página (Primary Key).
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Título da página.
   * @type {string}
   */
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  /**
   * Slug da página (usado na URL).
   * Deve ser único e amigável para SEO.
   * @type {string}
   */
  @Column({ type: 'varchar', length: 255, unique: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  slug: string;

  /**
   * Conteúdo da página (HTML ou Markdown).
   * @type {string}
   */
  @Column({ type: 'text' })
  @IsNotEmpty()
  @IsString()
  content: string;

  /**
   * Status da página (draft, published, archived).
   * @type {PageStatus}
   */
  @Column({ type: 'enum', enum: PageStatus, default: PageStatus.DRAFT })
  @IsEnum(PageStatus)
  @IsOptional()
  status: PageStatus;

  /**
   * Data de criação da página.
   * @type {Date}
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Data da última atualização da página.
   * @type {Date}
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
```
```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePageTable1678886400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pages',
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
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: false,
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pages');
  }
}
```