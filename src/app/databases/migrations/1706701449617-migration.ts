import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1706701449617 implements MigrationInterface {
    name = 'Migration1706701449617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "productType"`);
        await queryRunner.query(`CREATE TYPE "public"."product_producttype_enum" AS ENUM('DIGITAL', 'PHYSICAL')`);
        await queryRunner.query(`ALTER TABLE "product" ADD "productType" "public"."product_producttype_enum" NOT NULL DEFAULT 'PHYSICAL'`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."post_type_enum" AS ENUM('AUDIO', 'VIDEO', 'ARTICLE', 'GALLERY')`);
        await queryRunner.query(`ALTER TABLE "post" ADD "type" "public"."post_type_enum" NOT NULL DEFAULT 'ARTICLE'`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "model"`);
        await queryRunner.query(`CREATE TYPE "public"."comment_model_enum" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'GIFT', 'HELP', 'POST', 'GALLERY', 'COMMENT')`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "model" "public"."comment_model_enum" NOT NULL DEFAULT 'POST'`);
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "model"`);
        await queryRunner.query(`CREATE TYPE "public"."upload_model_enum" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'GIFT', 'HELP', 'POST', 'GALLERY', 'COMMENT')`);
        await queryRunner.query(`ALTER TABLE "upload" ADD "model" "public"."upload_model_enum" NOT NULL DEFAULT 'PRODUCT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "model"`);
        await queryRunner.query(`DROP TYPE "public"."upload_model_enum"`);
        await queryRunner.query(`ALTER TABLE "upload" ADD "model" character varying NOT NULL DEFAULT 'PRODUCT'`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "model"`);
        await queryRunner.query(`DROP TYPE "public"."comment_model_enum"`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "model" character varying NOT NULL DEFAULT 'POST'`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."post_type_enum"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "type" character varying NOT NULL DEFAULT 'ARTICLE'`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "productType"`);
        await queryRunner.query(`DROP TYPE "public"."product_producttype_enum"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "productType" character varying NOT NULL DEFAULT 'PHYSICAL'`);
    }

}
