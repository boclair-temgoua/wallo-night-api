import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1680802569024 implements MigrationInterface {
    name = 'migration1680802569024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD "slug" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "slug" character varying`);
        await queryRunner.query(`ALTER TABLE "sub_project" ADD "slug" character varying`);
        await queryRunner.query(`ALTER TABLE "project" ADD "slug" character varying`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD "slug" character varying`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "slug" character varying`);
        await queryRunner.query(`ALTER TABLE "contact_us" ADD "slug" character varying`);
        await queryRunner.query(`ALTER TABLE "testimonial" ADD "slug" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "testimonial" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "contact_us" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "contributor" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "sub_project" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "slug"`);
    }

}
