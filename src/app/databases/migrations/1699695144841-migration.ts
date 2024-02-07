import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1699695144841 implements MigrationInterface {
  name = 'Migration1699695144841';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client_order" DROP COLUMN "userClientId"`,
    );
    await queryRunner.query(`ALTER TABLE "client_order" ADD "productId" uuid`);
    await queryRunner.query(`ALTER TABLE "client_order" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "client_order" ADD "organizationId" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "post" ADD "categoryId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_1077d47e0112cad3c16bbcea6cd" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_1077d47e0112cad3c16bbcea6cd"`,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "categoryId"`);
    await queryRunner.query(
      `ALTER TABLE "client_order" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(`ALTER TABLE "client_order" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "client_order" DROP COLUMN "productId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_order" ADD "userClientId" uuid`,
    );
  }
}
