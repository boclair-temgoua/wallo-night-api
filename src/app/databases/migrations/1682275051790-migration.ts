import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1682275051790 implements MigrationInterface {
    name = 'Migration1682275051790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_af805517871fac10130dcad8801" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_af805517871fac10130dcad8801"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "organizationId"`);
    }

}
