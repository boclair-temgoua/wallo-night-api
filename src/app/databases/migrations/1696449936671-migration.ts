import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1696449936671 implements MigrationInterface {
    name = 'Migration1696449936671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" RENAME COLUMN "userId" TO "organizationId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" RENAME COLUMN "organizationId" TO "userId"`);
    }

}
