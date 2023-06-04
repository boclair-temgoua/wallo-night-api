import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1685859820147 implements MigrationInterface {
    name = 'Migration1685859820147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_ea878145fbe844520a4cb56d74e"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "organizationId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_ea878145fbe844520a4cb56d74e" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
