import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1709940398413 implements MigrationInterface {
  name = 'Migration1709940398413';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_item" RENAME COLUMN "organizationBeyerId" TO "organizationBuyerId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_item" RENAME COLUMN "organizationBuyerId" TO "organizationBeyerId"`,
    );
  }
}
