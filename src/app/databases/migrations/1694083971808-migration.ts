import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694083971808 implements MigrationInterface {
    name = 'Migration1694083971808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commission" DROP CONSTRAINT "UQ_d199b420a190ee860a4d8ab802a"`);
        await queryRunner.query(`ALTER TABLE "commission" DROP COLUMN "slug"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commission" ADD "slug" character varying`);
        await queryRunner.query(`ALTER TABLE "commission" ADD CONSTRAINT "UQ_d199b420a190ee860a4d8ab802a" UNIQUE ("slug")`);
    }

}
