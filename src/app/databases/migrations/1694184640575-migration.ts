import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694184640575 implements MigrationInterface {
    name = 'Migration1694184640575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "status" character varying NOT NULL DEFAULT 'ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "status" boolean NOT NULL DEFAULT true`);
    }

}
