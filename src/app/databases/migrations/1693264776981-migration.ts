import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1693264776981 implements MigrationInterface {
    name = 'Migration1693264776981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "isDiscount" TO "enableDiscount"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "enableDiscount" TO "isDiscount"`);
    }

}
