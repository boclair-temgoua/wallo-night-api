import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1689639329925 implements MigrationInterface {
    name = 'Migration1689639329925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currency" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "currency" ADD "amount" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currency" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "currency" ADD "amount" bigint`);
    }

}
