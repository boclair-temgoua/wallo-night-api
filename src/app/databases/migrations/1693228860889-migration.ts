import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1693228860889 implements MigrationInterface {
    name = 'Migration1693228860889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" DROP COLUMN "isActive"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" ADD "isActive" boolean NOT NULL DEFAULT false`);
    }

}
