import { MigrationInterface, QueryRunner } from "typeorm";

export class document1680427658368 implements MigrationInterface {
    name = 'document1680427658368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" ADD "type" character varying`);
        await queryRunner.query(`ALTER TABLE "document" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "type"`);
    }

}
