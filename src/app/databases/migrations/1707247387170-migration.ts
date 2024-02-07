import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1707247387170 implements MigrationInterface {
    name = 'Migration1707247387170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."cart_order_model_enum" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'HELP', 'POST', 'GALLERY', 'COMMENT')`);
        await queryRunner.query(`ALTER TABLE "cart_order" ADD "model" "public"."cart_order_model_enum" NOT NULL DEFAULT 'PRODUCT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_order" DROP COLUMN "model"`);
        await queryRunner.query(`DROP TYPE "public"."cart_order_model_enum"`);
    }

}
