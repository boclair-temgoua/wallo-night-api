import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698272205605 implements MigrationInterface {
    name = 'Migration1698272205605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "color" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "color"`);
    }

}
