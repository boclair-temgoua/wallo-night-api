import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1682352227807 implements MigrationInterface {
    name = 'Migration1682352227807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "organizationId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "organizationId" uuid`);
    }

}
