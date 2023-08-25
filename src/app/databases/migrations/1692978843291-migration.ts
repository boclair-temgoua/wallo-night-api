import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692978843291 implements MigrationInterface {
    name = 'Migration1692978843291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "urlMedia" character varying`);
        await queryRunner.query(`ALTER TABLE "product" ADD "messageAfterPurchase" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "messageAfterPurchase"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "urlMedia"`);
    }

}
