import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1691443647210 implements MigrationInterface {
    name = 'Migration1691443647210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "membership" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "membership" DROP COLUMN "isActive"`);
    }

}
