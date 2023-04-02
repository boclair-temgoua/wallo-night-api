import { MigrationInterface, QueryRunner } from "typeorm";

export class document1680428424465 implements MigrationInterface {
    name = 'document1680428424465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" ADD "url" character varying`);
        await queryRunner.query(`ALTER TABLE "document" ADD "type" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "url"`);
    }

}
