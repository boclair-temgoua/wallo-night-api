import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1680930229018 implements MigrationInterface {
    name = 'Migration1680930229018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contributor" DROP COLUMN "slug"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contributor" ADD "slug" character varying`);
    }

}
