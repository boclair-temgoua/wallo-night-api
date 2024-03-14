import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1709761874050 implements MigrationInterface {
  name = 'Migration1709761874050';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order_item" ADD "uploadFiles" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP COLUMN "uploadFiles"`,
    );
  }
}
