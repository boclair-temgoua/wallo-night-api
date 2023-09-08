import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694181866393 implements MigrationInterface {
    name = 'Migration1694181866393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commission" RENAME COLUMN "messageAfterPurchase" TO "messageAfterPayment"`);
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "messageAfterPurchase" TO "messageAfterPayment"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "messageAfterPayment" TO "messageAfterPurchase"`);
        await queryRunner.query(`ALTER TABLE "commission" RENAME COLUMN "messageAfterPayment" TO "messageAfterPurchase"`);
    }

}
