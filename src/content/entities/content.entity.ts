```typescript
// src/content/entities/content.entity.ts

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

/**
 * Enum representing the possible types of content.
 */
export enum ContentType {
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  IMAGE = 'image',
  JSON = 'json',
}

/**
 * Content entity.
 * Represents a single content item stored in the database.
 */
@Entity('content')
export class Content {
  /**
   * The unique identifier for the content.
   * Auto-generated primary key.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The key of the content.
   * Must be unique within the application.
   */
  @Column({ unique: true })
  @IsNotEmpty()
  @IsString()
  key: string;

  /**
   * The value of the content.
   * Can be any string.
   */
  @Column({ type: 'text' })
  @IsNotEmpty()
  @IsString()
  value: string;

  /**
   * The type of the content.
   * Restricts the possible values to the ContentType enum.
   */
  @Column({
    type: 'enum',
    enum: ContentType,
    default: ContentType.TEXT,
  })
  @IsEnum(ContentType)
  @IsOptional()
  type: ContentType;
}
```
```typescript
// src/migrations/1678886400000-CreateContentTable.ts

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateContentTable1678886400000 implements MigrationInterface {
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
            isUnique: true,
            length: '255',
          },
          {
            name: 'value',
            type: 'text',
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['text', 'number', 'boolean', 'image', 'json'],
            default: "'text'",
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('content');
  }
}
```