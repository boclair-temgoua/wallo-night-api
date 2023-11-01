import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698812745819 implements MigrationInterface {
    name = 'Migration1698812745819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "whoCanSee"`);
        await queryRunner.query(`DROP TYPE "public"."post_whocansee_enum"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "whoCanSee" character varying NOT NULL DEFAULT 'PUBLIC'`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."post_type_enum"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "type" character varying NOT NULL DEFAULT 'ARTICLE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."post_type_enum" AS ENUM('AUDIO', 'ARTICLE', 'GALLERY')`);
        await queryRunner.query(`ALTER TABLE "post" ADD "type" "public"."post_type_enum" NOT NULL DEFAULT 'ARTICLE'`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "whoCanSee"`);
        await queryRunner.query(`CREATE TYPE "public"."post_whocansee_enum" AS ENUM('PUBLIC', 'MEMBERSHIP', 'SUPPORTER')`);
        await queryRunner.query(`ALTER TABLE "post" ADD "whoCanSee" "public"."post_whocansee_enum" NOT NULL DEFAULT 'PUBLIC'`);
    }

}
