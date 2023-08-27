import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1693140575830 implements MigrationInterface {
    name = 'Migration1693140575830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "discount" ADD "code" character varying`);
        await queryRunner.query(`ALTER TABLE "discount" ADD "isExpiredAt" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" DROP COLUMN "isExpiredAt"`);
        await queryRunner.query(`ALTER TABLE "discount" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "discount" ADD "name" character varying`);
    }

}
