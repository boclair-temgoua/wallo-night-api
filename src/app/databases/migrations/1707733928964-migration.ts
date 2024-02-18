import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1707733928964 implements MigrationInterface {
  name = 'Migration1707733928964';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_order" DROP CONSTRAINT "FK_52abc6c6e8cb9e3b8f3a32c68c2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" RENAME COLUMN "organizationId" TO "organizationSellerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_order" RENAME COLUMN "organizationId" TO "organizationSellerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_order" ADD CONSTRAINT "FK_548cf9bf21e5d9d13d094bd53a9" FOREIGN KEY ("organizationSellerId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_order" DROP CONSTRAINT "FK_548cf9bf21e5d9d13d094bd53a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_order" RENAME COLUMN "organizationSellerId" TO "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" RENAME COLUMN "organizationSellerId" TO "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_order" ADD CONSTRAINT "FK_52abc6c6e8cb9e3b8f3a32c68c2" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
