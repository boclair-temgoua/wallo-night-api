import { MigrationInterface, QueryRunner } from "typeorm";

export class organizaton1680453064771 implements MigrationInterface {
    name = 'organizaton1680453064771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_project" ADD "image" character varying`);
        await queryRunner.query(`ALTER TABLE "project" ADD "image" character varying`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "sub_project" DROP COLUMN "image"`);
    }

}
