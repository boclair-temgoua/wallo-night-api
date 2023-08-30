import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1693392011276 implements MigrationInterface {
    name = 'Migration1693392011276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "urlMedia" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "urlMedia"`);
    }

}
