import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1699480413545 implements MigrationInterface {
  name = 'Migration1699480413545';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cart_order" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "organizationId" uuid, CONSTRAINT "PK_02e2f497e8ed712f493dc8262f8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "cart" ADD "cartOrderId" uuid`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "cartOrderId"`);
    await queryRunner.query(`DROP TABLE "cart_order"`);
  }
}
