import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1707248186577 implements MigrationInterface {
  name = 'Migration1707248186577';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."cart_model_enum" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'HELP', 'POST', 'GALLERY', 'COMMENT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD "model" "public"."cart_model_enum" NOT NULL DEFAULT 'COMMISSION'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "model"`);
    await queryRunner.query(`DROP TYPE "public"."cart_model_enum"`);
  }
}
