import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694551166123 implements MigrationInterface {
    name = 'Migration1694551166123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "membership" ADD "pricePerYearly" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "membership" DROP COLUMN "pricePerYearly"`);
    }

}
