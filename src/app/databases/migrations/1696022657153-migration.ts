import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1696022657153 implements MigrationInterface {
    name = 'Migration1696022657153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "currency" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "currency"`);
    }

}
