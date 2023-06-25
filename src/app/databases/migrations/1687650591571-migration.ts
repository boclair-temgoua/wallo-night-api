import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1687650591571 implements MigrationInterface {
    name = 'Migration1687650591571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "amount" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "amount"`);
    }

}
