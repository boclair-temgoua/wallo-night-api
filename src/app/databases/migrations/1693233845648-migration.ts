import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1693233845648 implements MigrationInterface {
    name = 'Migration1693233845648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" RENAME COLUMN "expiredAtIsNull" TO "enableExpiredAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" RENAME COLUMN "enableExpiredAt" TO "expiredAtIsNull"`);
    }

}
