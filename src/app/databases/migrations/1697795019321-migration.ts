import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1697795019321 implements MigrationInterface {
    name = 'Migration1697795019321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_event" ADD "currency" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_event" DROP COLUMN "currency"`);
    }

}
