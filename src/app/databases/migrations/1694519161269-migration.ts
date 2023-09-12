import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694519161269 implements MigrationInterface {
    name = 'Migration1694519161269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" RENAME COLUMN "type" TO "model"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" RENAME COLUMN "model" TO "type"`);
    }

}
