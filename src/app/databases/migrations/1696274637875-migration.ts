import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1696274637875 implements MigrationInterface {
    name = 'Migration1696274637875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "event" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "project" ADD "organizationId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "organizationId"`);
    }

}
