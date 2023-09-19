import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1695146936465 implements MigrationInterface {
    name = 'Migration1695146936465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "urlRedirect" character varying`);
        await queryRunner.query(`ALTER TABLE "product" ADD "enableUrlRedirect" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "enableUrlRedirect"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "urlRedirect"`);
    }

}
