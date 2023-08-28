import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1693214983235 implements MigrationInterface {
    name = 'Migration1693214983235'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" RENAME COLUMN "code" TO "name"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "isDiscount" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "isDiscount"`);
        await queryRunner.query(`ALTER TABLE "discount" RENAME COLUMN "name" TO "code"`);
    }

}
