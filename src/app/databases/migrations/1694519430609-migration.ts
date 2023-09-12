import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694519430609 implements MigrationInterface {
    name = 'Migration1694519430609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" RENAME COLUMN "model" TO "model"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" RENAME COLUMN "model" TO "model"`);
    }

}
