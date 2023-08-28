import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1693215434150 implements MigrationInterface {
    name = 'Migration1693215434150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" RENAME COLUMN "name" TO "code"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" RENAME COLUMN "code" TO "name"`);
    }

}
