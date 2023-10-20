import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1697798330612 implements MigrationInterface {
    name = 'Migration1697798330612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "quantity" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "quantity"`);
    }

}
