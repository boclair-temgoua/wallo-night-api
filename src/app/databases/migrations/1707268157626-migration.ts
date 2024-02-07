import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1707268157626 implements MigrationInterface {
  name = 'Migration1707268157626';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ADD "orderNumber" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD "orderNumber" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP COLUMN "orderNumber"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "orderNumber"`);
  }
}
