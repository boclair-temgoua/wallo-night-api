import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1697798144909 implements MigrationInterface {
    name = 'Migration1697798144909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "amount" double precision`);
        await queryRunner.query(`ALTER TABLE "order_event" DROP COLUMN "priceEvent"`);
        await queryRunner.query(`ALTER TABLE "order_event" ADD "priceEvent" double precision`);
        await queryRunner.query(`ALTER TABLE "our_event" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "our_event" ADD "price" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "our_event" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "our_event" ADD "price" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order_event" DROP COLUMN "priceEvent"`);
        await queryRunner.query(`ALTER TABLE "order_event" ADD "priceEvent" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "amount" bigint`);
    }

}
