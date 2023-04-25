import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1682353211895 implements MigrationInterface {
    name = 'Migration1682353211895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "slug"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "slug" character varying`);
    }

}
