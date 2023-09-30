import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1696028140303 implements MigrationInterface {
    name = 'Migration1696028140303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "model" character varying NOT NULL DEFAULT 'MEMBERSHIP'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "model"`);
    }

}
