import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1691579682604 implements MigrationInterface {
    name = 'Migration1691579682604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "membership" ALTER COLUMN "pricePerMonthly" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "membership" ALTER COLUMN "pricePerYearly" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "membership" ALTER COLUMN "pricePerYearly" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "membership" ALTER COLUMN "pricePerMonthly" SET NOT NULL`);
    }

}
