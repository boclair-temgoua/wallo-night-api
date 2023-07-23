import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1690132930246 implements MigrationInterface {
    name = 'Migration1690132930246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "deletedAt"`);
    }

}
