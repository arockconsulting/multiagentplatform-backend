```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/**
 * Migration responsável por criar a tabela de contatos no banco de dados.
 */
export class CreateContactsTable1678886400002 implements MigrationInterface {
  /**
   * Nome da tabela que será criada.
   */
  private readonly tableName = 'contacts';

  /**
   * Método responsável por executar a migração, criando a tabela de contatos.
   * @param queryRunner QueryRunner - Instância do QueryRunner utilizada para executar as queries.
   * @returns Promise<void>
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
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
        ],
      }),
      true,
    );
  }

  /**
   * Método responsável por desfazer a migração, removendo a tabela de contatos.
   * @param queryRunner QueryRunner - Instância do QueryRunner utilizada para executar as queries.
   * @returns Promise<void>
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
```