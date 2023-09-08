import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694138770367 implements MigrationInterface {
    name = 'Migration1694138770367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commission" ADD "isLimitSlot" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "commission" ADD "limitSlot" bigint NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commission" DROP COLUMN "limitSlot"`);
        await queryRunner.query(`ALTER TABLE "commission" DROP COLUMN "isLimitSlot"`);
    }

}
