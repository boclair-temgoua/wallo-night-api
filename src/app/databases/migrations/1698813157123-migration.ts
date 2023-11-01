import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698813157123 implements MigrationInterface {
    name = 'Migration1698813157123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "whoCanSee"`);
        await queryRunner.query(`CREATE TYPE "public"."product_whocansee_enum" AS ENUM('PUBLIC', 'MEMBERSHIP', 'SUPPORTER')`);
        await queryRunner.query(`ALTER TABLE "product" ADD "whoCanSee" "public"."product_whocansee_enum" NOT NULL DEFAULT 'PUBLIC'`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "whoCanSee"`);
        await queryRunner.query(`CREATE TYPE "public"."post_whocansee_enum" AS ENUM('PUBLIC', 'MEMBERSHIP', 'SUPPORTER')`);
        await queryRunner.query(`ALTER TABLE "post" ADD "whoCanSee" "public"."post_whocansee_enum" NOT NULL DEFAULT 'PUBLIC'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "whoCanSee"`);
        await queryRunner.query(`DROP TYPE "public"."post_whocansee_enum"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "whoCanSee" character varying NOT NULL DEFAULT 'PUBLIC'`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "whoCanSee"`);
        await queryRunner.query(`DROP TYPE "public"."product_whocansee_enum"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "whoCanSee" character varying NOT NULL DEFAULT 'PUBLIC'`);
    }

}
