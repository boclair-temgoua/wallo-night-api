import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694219131973 implements MigrationInterface {
    name = 'Migration1694219131973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commission" RENAME COLUMN "isLimitSlot" TO "enableLimitSlot"`);
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "isLimitSlot" TO "enableLimitSlot"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "enableLimitSlot" TO "isLimitSlot"`);
        await queryRunner.query(`ALTER TABLE "commission" RENAME COLUMN "enableLimitSlot" TO "isLimitSlot"`);
    }

}
