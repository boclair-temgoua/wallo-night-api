import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1693098355875 implements MigrationInterface {
    name = 'Migration1693098355875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" RENAME COLUMN "type" TO "uploadType"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" RENAME COLUMN "uploadType" TO "type"`);
    }

}
