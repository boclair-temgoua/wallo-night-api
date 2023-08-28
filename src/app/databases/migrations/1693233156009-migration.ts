import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1693233156009 implements MigrationInterface {
    name = 'Migration1693233156009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" RENAME COLUMN "isExpiredActive" TO "expiredAtIsNull"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" RENAME COLUMN "expiredAtIsNull" TO "isExpiredActive"`);
    }

}
