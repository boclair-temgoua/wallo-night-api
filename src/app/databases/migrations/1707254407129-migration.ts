import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1707254407129 implements MigrationInterface {
  name = 'Migration1707254407129';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "priceTotalNotDiscount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "priceTotalDiscount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "totalPriceDiscount" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "totalPrice" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "totalPrice"`);
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "totalPriceDiscount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "priceTotalDiscount" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "priceTotalNotDiscount" bigint`,
    );
  }
}
