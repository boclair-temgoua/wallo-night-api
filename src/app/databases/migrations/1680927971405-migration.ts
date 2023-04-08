import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1680927971405 implements MigrationInterface {
    name = 'Migration1680927971405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_sub_project" ADD "projectId" uuid`);
        await queryRunner.query(`ALTER TABLE "sub_sub_project" ADD "organizationId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_sub_project" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "sub_sub_project" DROP COLUMN "projectId"`);
    }

}
