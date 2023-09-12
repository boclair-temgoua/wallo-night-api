import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694512681925 implements MigrationInterface {
    name = 'Migration1694512681925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "media"`);
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "commissionId"`);
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "postId"`);
        await queryRunner.query(`ALTER TABLE "upload" ADD "type" character varying NOT NULL DEFAULT 'PRODUCT'`);
        await queryRunner.query(`ALTER TABLE "upload" ADD "uploadableId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "uploadableId"`);
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "upload" ADD "postId" uuid`);
        await queryRunner.query(`ALTER TABLE "upload" ADD "commissionId" uuid`);
        await queryRunner.query(`ALTER TABLE "upload" ADD "productId" uuid`);
        await queryRunner.query(`ALTER TABLE "post" ADD "media" character varying`);
        await queryRunner.query(`ALTER TABLE "post" ADD "image" character varying`);
    }

}
