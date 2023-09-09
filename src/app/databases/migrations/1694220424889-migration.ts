import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694220424889 implements MigrationInterface {
    name = 'Migration1694220424889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "isChooseQuantity" TO "enableChooseQuantity"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "enableChooseQuantity" TO "isChooseQuantity"`);
    }

}
