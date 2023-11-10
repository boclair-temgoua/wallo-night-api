import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1699558221367 implements MigrationInterface {
    name = 'Migration1699558221367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD "organizationId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "organizationId"`);
    }

}
