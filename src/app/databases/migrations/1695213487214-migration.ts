import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1695213487214 implements MigrationInterface {
    name = 'Migration1695213487214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "productType" character varying NOT NULL DEFAULT 'PHYSICAL'`);
        await queryRunner.query(`ALTER TABLE "product" ADD "whoCanSee" character varying NOT NULL DEFAULT 'PUBLIC'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "whoCanSee"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "productType"`);
    }

}
