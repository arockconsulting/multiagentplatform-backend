```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/**
 * Migration responsável por criar a tabela de Content.
 */
export class CreateContentTable implements MigrationInterface {
  /**
   * Aplica a migration, criando a tabela `content`.
   *
   * @param queryRunner O QueryRunner utilizado para executar as queries.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'content',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'key',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'value',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
            length: '50',
            default: "'text'", // Valor padrão para o tipo de conteúdo
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  /**
   * Reverte a migration, removendo a tabela `content`.
   *
   * @param queryRunner O QueryRunner utilizado para executar as queries.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('content');
  }
}
```
```typescript
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Enumeração que define os tipos de conteúdo suportados.
 */
export enum ContentType {
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  IMAGE = 'image',
  JSON = 'json',
}

/**
 * Entidade que representa o conteúdo armazenado no banco de dados.
 */
@Entity('content')
export class ContentEntity {
  /**
   * Identificador único do conteúdo.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Chave única que identifica o conteúdo.
   */
  @Column({ unique: true, length: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  key: string;

  /**
   * Valor do conteúdo.
   */
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  value: string;

  /**
   * Tipo do conteúdo.
   */
  @Column({ type: 'varchar', length: 50, default: ContentType.TEXT })
  @IsNotEmpty()
  @IsEnum(ContentType)
  type: ContentType;

  /**
   * Data de criação do conteúdo.
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Data da última atualização do conteúdo.
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```