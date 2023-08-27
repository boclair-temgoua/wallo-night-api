import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1693091370424 implements MigrationInterface {
    name = 'Migration1693091370424'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" ADD "type" character varying NOT NULL DEFAULT 'IMAGE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "type"`);
    }

}
