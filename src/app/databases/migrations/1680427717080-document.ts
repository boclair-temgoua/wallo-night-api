import { MigrationInterface, QueryRunner } from "typeorm";

export class document1680427717080 implements MigrationInterface {
    name = 'document1680427717080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "document" ADD "title" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "document" ADD "type" character varying`);
        await queryRunner.query(`ALTER TABLE "document" ADD "name" character varying`);
    }

}
