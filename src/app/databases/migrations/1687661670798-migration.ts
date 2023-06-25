import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1687661670798 implements MigrationInterface {
    name = 'Migration1687661670798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "donation" DROP COLUMN "slug"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation" ADD "slug" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "slug" character varying`);
    }

}
