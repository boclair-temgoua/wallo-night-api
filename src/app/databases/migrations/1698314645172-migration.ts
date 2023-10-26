import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698314645172 implements MigrationInterface {
    name = 'Migration1698314645172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "color" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "color"`);
    }

}
