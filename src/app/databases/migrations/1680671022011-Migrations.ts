import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1680671022011 implements MigrationInterface {
    name = 'Migrations1680671022011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "countryId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD "countryId" integer`);
        await queryRunner.query(`ALTER TABLE "category" ADD "image" character varying`);
    }

}
