import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1706742987580 implements MigrationInterface {
  name = 'Migration1706742987580';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_8e50cf45135c794a78ad18db6c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contribution" DROP CONSTRAINT "FK_1a142b8239500ddab2b4466f2e3"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "giftId"`);
    await queryRunner.query(`ALTER TABLE "contribution" DROP COLUMN "giftId"`);
    await queryRunner.query(
      `ALTER TYPE "public"."comment_model_enum" RENAME TO "comment_model_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."comment_model_enum" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'HELP', 'POST', 'GALLERY', 'COMMENT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ALTER COLUMN "model" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ALTER COLUMN "model" TYPE "public"."comment_model_enum" USING "model"::"text"::"public"."comment_model_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ALTER COLUMN "model" SET DEFAULT 'POST'`,
    );
    await queryRunner.query(`DROP TYPE "public"."comment_model_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."upload_model_enum" RENAME TO "upload_model_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."upload_model_enum" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'HELP', 'POST', 'GALLERY', 'COMMENT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" ALTER COLUMN "model" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" ALTER COLUMN "model" TYPE "public"."upload_model_enum" USING "model"::"text"::"public"."upload_model_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" ALTER COLUMN "model" SET DEFAULT 'PRODUCT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."upload_model_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."upload_model_enum_old" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'GIFT', 'HELP', 'POST', 'GALLERY', 'COMMENT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" ALTER COLUMN "model" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" ALTER COLUMN "model" TYPE "public"."upload_model_enum_old" USING "model"::"text"::"public"."upload_model_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" ALTER COLUMN "model" SET DEFAULT 'PRODUCT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."upload_model_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."upload_model_enum_old" RENAME TO "upload_model_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."comment_model_enum_old" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'GIFT', 'HELP', 'POST', 'GALLERY', 'COMMENT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ALTER COLUMN "model" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ALTER COLUMN "model" TYPE "public"."comment_model_enum_old" USING "model"::"text"::"public"."comment_model_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ALTER COLUMN "model" SET DEFAULT 'POST'`,
    );
    await queryRunner.query(`DROP TYPE "public"."comment_model_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."comment_model_enum_old" RENAME TO "comment_model_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "contribution" ADD "giftId" uuid`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "giftId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "contribution" ADD CONSTRAINT "FK_1a142b8239500ddab2b4466f2e3" FOREIGN KEY ("giftId") REFERENCES "gift"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_8e50cf45135c794a78ad18db6c5" FOREIGN KEY ("giftId") REFERENCES "gift"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
