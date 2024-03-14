import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1710359710318 implements MigrationInterface {
  name = 'Migration1710359710318';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profile" ADD "social" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "social"`);
  }
}
