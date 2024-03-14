import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1710360815001 implements MigrationInterface {
  name = 'Migration1710360815001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."cart_model_enum" RENAME TO "cart_model_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."cart_model_enum" AS ENUM('DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'HELP', 'POST', 'PROFILE', 'GALLERY', 'COMMENT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ALTER COLUMN "model" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ALTER COLUMN "model" TYPE "public"."cart_model_enum" USING "model"::"text"::"public"."cart_model_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ALTER COLUMN "model" SET DEFAULT 'COMMISSION'`,
    );
    await queryRunner.query(`DROP TYPE "public"."cart_model_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."cart_order_model_enum" RENAME TO "cart_order_model_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."cart_order_model_enum" AS ENUM('DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'HELP', 'POST', 'PROFILE', 'GALLERY', 'COMMENT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_order" ALTER COLUMN "model" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_order" ALTER COLUMN "model" TYPE "public"."cart_order_model_enum" USING "model"::"text"::"public"."cart_order_model_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_order" ALTER COLUMN "model" SET DEFAULT 'PRODUCT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."cart_order_model_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."comment_model_enum" RENAME TO "comment_model_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."comment_model_enum" AS ENUM('DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'HELP', 'POST', 'PROFILE', 'GALLERY', 'COMMENT')`,
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
      `ALTER TYPE "public"."product_model_enum" RENAME TO "product_model_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."product_model_enum" AS ENUM('DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'HELP', 'POST', 'PROFILE', 'GALLERY', 'COMMENT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "model" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "model" TYPE "public"."product_model_enum" USING "model"::"text"::"public"."product_model_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "model" SET DEFAULT 'PRODUCT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."product_model_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."commission_model_enum" RENAME TO "commission_model_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."commission_model_enum" AS ENUM('DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'HELP', 'POST', 'PROFILE', 'GALLERY', 'COMMENT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "commission" ALTER COLUMN "model" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "commission" ALTER COLUMN "model" TYPE "public"."commission_model_enum" USING "model"::"text"::"public"."commission_model_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commission" ALTER COLUMN "model" SET DEFAULT 'COMMISSION'`,
    );
    await queryRunner.query(`DROP TYPE "public"."commission_model_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."order_item_model_enum" RENAME TO "order_item_model_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_item_model_enum" AS ENUM('DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'HELP', 'POST', 'PROFILE', 'GALLERY', 'COMMENT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ALTER COLUMN "model" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ALTER COLUMN "model" TYPE "public"."order_item_model_enum" USING "model"::"text"::"public"."order_item_model_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ALTER COLUMN "model" SET DEFAULT 'PRODUCT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."order_item_model_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."post_model_enum" RENAME TO "post_model_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."post_model_enum" AS ENUM('DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'HELP', 'POST', 'PROFILE', 'GALLERY', 'COMMENT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "model" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "model" TYPE "public"."post_model_enum" USING "model"::"text"::"public"."post_model_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "model" SET DEFAULT 'POST'`,
    );
    await queryRunner.query(`DROP TYPE "public"."post_model_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."upload_model_enum" RENAME TO "upload_model_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."upload_model_enum" AS ENUM('DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'HELP', 'POST', 'PROFILE', 'GALLERY', 'COMMENT')`,
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
    await queryRunner.query(
      `ALTER TYPE "public"."membership_model_enum" RENAME TO "membership_model_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."membership_model_enum" AS ENUM('DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'HELP', 'POST', 'PROFILE', 'GALLERY', 'COMMENT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "membership" ALTER COLUMN "model" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "membership" ALTER COLUMN "model" TYPE "public"."membership_model_enum" USING "model"::"text"::"public"."membership_model_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "membership" ALTER COLUMN "model" SET DEFAULT 'MEMBERSHIP'`,
    );
    await queryRunner.query(`DROP TYPE "public"."membership_model_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."membership_model_enum_old" AS ENUM('COMMENT', 'COMMISSION', 'DONATION', 'GALLERY', 'HELP', 'MEMBERSHIP', 'POST', 'PRODUCT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "membership" ALTER COLUMN "model" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "membership" ALTER COLUMN "model" TYPE "public"."membership_model_enum_old" USING "model"::"text"::"public"."membership_model_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "membership" ALTER COLUMN "model" SET DEFAULT 'MEMBERSHIP'`,
    );
    await queryRunner.query(`DROP TYPE "public"."membership_model_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."membership_model_enum_old" RENAME TO "membership_model_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."upload_model_enum_old" AS ENUM('COMMENT', 'COMMISSION', 'DONATION', 'GALLERY', 'HELP', 'MEMBERSHIP', 'POST', 'PRODUCT')`,
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
      `CREATE TYPE "public"."post_model_enum_old" AS ENUM('COMMENT', 'COMMISSION', 'DONATION', 'GALLERY', 'HELP', 'MEMBERSHIP', 'POST', 'PRODUCT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "model" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "model" TYPE "public"."post_model_enum_old" USING "model"::"text"::"public"."post_model_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "model" SET DEFAULT 'POST'`,
    );
    await queryRunner.query(`DROP TYPE "public"."post_model_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."post_model_enum_old" RENAME TO "post_model_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_item_model_enum_old" AS ENUM('COMMENT', 'COMMISSION', 'DONATION', 'GALLERY', 'HELP', 'MEMBERSHIP', 'POST', 'PRODUCT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ALTER COLUMN "model" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ALTER COLUMN "model" TYPE "public"."order_item_model_enum_old" USING "model"::"text"::"public"."order_item_model_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ALTER COLUMN "model" SET DEFAULT 'PRODUCT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."order_item_model_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."order_item_model_enum_old" RENAME TO "order_item_model_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."commission_model_enum_old" AS ENUM('COMMENT', 'COMMISSION', 'DONATION', 'GALLERY', 'HELP', 'MEMBERSHIP', 'POST', 'PRODUCT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "commission" ALTER COLUMN "model" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "commission" ALTER COLUMN "model" TYPE "public"."commission_model_enum_old" USING "model"::"text"::"public"."commission_model_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commission" ALTER COLUMN "model" SET DEFAULT 'COMMISSION'`,
    );
    await queryRunner.query(`DROP TYPE "public"."commission_model_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."commission_model_enum_old" RENAME TO "commission_model_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."product_model_enum_old" AS ENUM('COMMENT', 'COMMISSION', 'DONATION', 'GALLERY', 'HELP', 'MEMBERSHIP', 'POST', 'PRODUCT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "model" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "model" TYPE "public"."product_model_enum_old" USING "model"::"text"::"public"."product_model_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "model" SET DEFAULT 'PRODUCT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."product_model_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."product_model_enum_old" RENAME TO "product_model_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."comment_model_enum_old" AS ENUM('COMMENT', 'COMMISSION', 'DONATION', 'GALLERY', 'HELP', 'MEMBERSHIP', 'POST', 'PRODUCT')`,
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
    await queryRunner.query(
      `CREATE TYPE "public"."cart_order_model_enum_old" AS ENUM('COMMENT', 'COMMISSION', 'DONATION', 'GALLERY', 'HELP', 'MEMBERSHIP', 'POST', 'PRODUCT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_order" ALTER COLUMN "model" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_order" ALTER COLUMN "model" TYPE "public"."cart_order_model_enum_old" USING "model"::"text"::"public"."cart_order_model_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_order" ALTER COLUMN "model" SET DEFAULT 'PRODUCT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."cart_order_model_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."cart_order_model_enum_old" RENAME TO "cart_order_model_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."cart_model_enum_old" AS ENUM('COMMENT', 'COMMISSION', 'DONATION', 'GALLERY', 'HELP', 'MEMBERSHIP', 'POST', 'PRODUCT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ALTER COLUMN "model" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ALTER COLUMN "model" TYPE "public"."cart_model_enum_old" USING "model"::"text"::"public"."cart_model_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ALTER COLUMN "model" SET DEFAULT 'COMMISSION'`,
    );
    await queryRunner.query(`DROP TYPE "public"."cart_model_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."cart_model_enum_old" RENAME TO "cart_model_enum"`,
    );
  }
}
