import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1697796827506 implements MigrationInterface {
    name = 'Migration1697796827506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_event" DROP COLUMN "transactionId"`);
        await queryRunner.query(`ALTER TABLE "order_event" ADD "transactionId" uuid`);
        await queryRunner.query(`ALTER TABLE "order_event" ADD CONSTRAINT "FK_01327c6aa147cc5eeb8ce48ed00" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_event" DROP CONSTRAINT "FK_01327c6aa147cc5eeb8ce48ed00"`);
        await queryRunner.query(`ALTER TABLE "order_event" DROP COLUMN "transactionId"`);
        await queryRunner.query(`ALTER TABLE "order_event" ADD "transactionId" character varying`);
    }

}
