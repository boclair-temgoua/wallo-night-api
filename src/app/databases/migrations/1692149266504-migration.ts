import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692149266504 implements MigrationInterface {
    name = 'Migration1692149266504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" DROP COLUMN "deletedAt"`);
    }

}
