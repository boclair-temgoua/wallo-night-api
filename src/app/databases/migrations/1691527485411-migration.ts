import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1691527485411 implements MigrationInterface {
    name = 'Migration1691527485411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery" RENAME COLUMN "url" TO "path"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery" RENAME COLUMN "path" TO "url"`);
    }

}
