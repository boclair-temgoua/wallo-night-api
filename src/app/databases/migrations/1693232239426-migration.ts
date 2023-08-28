import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1693232239426 implements MigrationInterface {
    name = 'Migration1693232239426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" RENAME COLUMN "isExpired" TO "isExpiredActive"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" RENAME COLUMN "isExpiredActive" TO "isExpired"`);
    }

}
