import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1693141228392 implements MigrationInterface {
    name = 'Migration1693141228392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" RENAME COLUMN "isExpiredAt" TO "isExpired"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" RENAME COLUMN "isExpired" TO "isExpiredAt"`);
    }

}
