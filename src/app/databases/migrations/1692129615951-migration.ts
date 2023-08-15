import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692129615951 implements MigrationInterface {
    name = 'Migration1692129615951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_category" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "post_category" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "post_category" DROP COLUMN "deletedAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_category" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "post_category" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "post_category" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
