import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1683275420077 implements MigrationInterface {
    name = 'Migration1683275420077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_us" DROP COLUMN "slug"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_us" ADD "slug" character varying`);
    }

}
