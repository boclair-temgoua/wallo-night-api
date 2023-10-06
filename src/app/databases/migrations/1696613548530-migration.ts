import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1696613548530 implements MigrationInterface {
    name = 'Migration1696613548530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "membership" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "upload" ADD "organizationId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP COLUMN "organizationId"`);
    }

}
