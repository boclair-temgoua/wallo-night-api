import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1709920861474 implements MigrationInterface {
    name = 'Migration1709920861474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "address" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD "address" jsonb`);
    }

}
