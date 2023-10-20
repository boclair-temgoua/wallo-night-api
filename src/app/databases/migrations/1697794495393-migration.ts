import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1697794495393 implements MigrationInterface {
    name = 'Migration1697794495393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_event" ADD "title" character varying`);
        await queryRunner.query(`ALTER TABLE "order_event" ADD "priceEvent" character varying`);
        await queryRunner.query(`ALTER TABLE "order_event" ADD "imageEvent" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_event" DROP COLUMN "imageEvent"`);
        await queryRunner.query(`ALTER TABLE "order_event" DROP COLUMN "priceEvent"`);
        await queryRunner.query(`ALTER TABLE "order_event" DROP COLUMN "title"`);
    }

}
