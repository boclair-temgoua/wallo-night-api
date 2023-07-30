import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1690673819472 implements MigrationInterface {
    name = 'Migration1690673819472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "description"`);
    }

}
