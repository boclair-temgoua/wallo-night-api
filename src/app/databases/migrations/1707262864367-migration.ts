import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1707262864367 implements MigrationInterface {
  name = 'Migration1707262864367';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "totalPrice" TO "totalPriceNoDiscount"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "totalPriceNoDiscount" TO "totalPrice"`,
    );
  }
}
