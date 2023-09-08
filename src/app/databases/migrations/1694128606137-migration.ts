import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694128606137 implements MigrationInterface {
    name = 'Migration1694128606137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" ADD "commissionId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "commissionId"`);
    }

}
