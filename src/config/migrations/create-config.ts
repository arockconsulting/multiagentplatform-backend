```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to create the `config` table.
 */
export class CreateConfig1678886400000 implements MigrationInterface {
  /**
   * Applies the migration, creating the `config` table.
   *
   * @param queryRunner The QueryRunner instance used to execute database queries.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "config" (
                "id" SERIAL PRIMARY KEY,
                "key" character varying NOT NULL UNIQUE,
                "value" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);
  }

  /**
   * Reverts the migration, dropping the `config` table.
   *
   * @param queryRunner The QueryRunner instance used to execute database queries.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "config"
        `);
  }
}
```