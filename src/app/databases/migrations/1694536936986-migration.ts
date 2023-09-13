import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694536936986 implements MigrationInterface {
    name = 'Migration1694536936986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "membership" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP COLUMN "pricePerYearly"`);
        await queryRunner.query(`ALTER TABLE "membership" ADD "status" character varying NOT NULL DEFAULT 'ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "membership" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "membership" ADD "pricePerYearly" double precision`);
        await queryRunner.query(`ALTER TABLE "membership" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "membership" ADD "image" character varying`);
    }

}
