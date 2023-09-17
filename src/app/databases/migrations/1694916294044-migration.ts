import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694916294044 implements MigrationInterface {
    name = 'Migration1694916294044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "token"`);
    }

}
