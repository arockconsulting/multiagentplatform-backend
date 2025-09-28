```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/**
 * Migration responsável por criar a tabela de contatos.
 */
export class CreateContact1678886400000 implements MigrationInterface {
  /**
   * Aplica a migration, criando a tabela `contact`.
   * @param queryRunner O QueryRunner utilizado para executar as queries.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'contact',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'message',
            type: 'text',
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
   * Reverte a migration, removendo a tabela `contact`.
   * @param queryRunner O QueryRunner utilizado para executar as queries.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('contact');
  }
}
```