import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1707247033520 implements MigrationInterface {
    name = 'Migration1707247033520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."product_model_enum" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'HELP', 'POST', 'GALLERY', 'COMMENT')`);
        await queryRunner.query(`ALTER TABLE "product" ADD "model" "public"."product_model_enum" NOT NULL DEFAULT 'PRODUCT'`);
        await queryRunner.query(`CREATE TYPE "public"."commission_model_enum" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'HELP', 'POST', 'GALLERY', 'COMMENT')`);
        await queryRunner.query(`ALTER TABLE "commission" ADD "model" "public"."commission_model_enum" NOT NULL DEFAULT 'COMMISSION'`);
        await queryRunner.query(`CREATE TYPE "public"."post_model_enum" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'HELP', 'POST', 'GALLERY', 'COMMENT')`);
        await queryRunner.query(`ALTER TABLE "post" ADD "model" "public"."post_model_enum" NOT NULL DEFAULT 'POST'`);
        await queryRunner.query(`CREATE TYPE "public"."membership_model_enum" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'HELP', 'POST', 'GALLERY', 'COMMENT')`);
        await queryRunner.query(`ALTER TABLE "membership" ADD "model" "public"."membership_model_enum" NOT NULL DEFAULT 'MEMBERSHIP'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "membership" DROP COLUMN "model"`);
        await queryRunner.query(`DROP TYPE "public"."membership_model_enum"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "model"`);
        await queryRunner.query(`DROP TYPE "public"."post_model_enum"`);
        await queryRunner.query(`ALTER TABLE "commission" DROP COLUMN "model"`);
        await queryRunner.query(`DROP TYPE "public"."commission_model_enum"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "model"`);
        await queryRunner.query(`DROP TYPE "public"."product_model_enum"`);
    }

}
