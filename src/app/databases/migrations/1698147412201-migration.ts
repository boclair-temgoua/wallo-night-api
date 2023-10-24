import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698147412201 implements MigrationInterface {
    name = 'Migration1698147412201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "membership" DROP COLUMN "pricePerMonthly"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP COLUMN "pricePerYearly"`);
        await queryRunner.query(`ALTER TABLE "membership" ADD "price" double precision`);
        await queryRunner.query(`ALTER TABLE "membership" ADD "month" bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "membership" DROP COLUMN "month"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "membership" ADD "pricePerYearly" double precision`);
        await queryRunner.query(`ALTER TABLE "membership" ADD "pricePerMonthly" double precision`);
    }

}
