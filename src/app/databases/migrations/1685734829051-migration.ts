import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1685734829051 implements MigrationInterface {
    name = 'Migration1685734829051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "userCreatedId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "userCreatedId"`);
    }

}
