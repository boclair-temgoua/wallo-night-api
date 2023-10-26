import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698310901859 implements MigrationInterface {
    name = 'Migration1698310901859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "model" character varying NOT NULL DEFAULT 'POST'`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_a3422826753d4e6b079dea98342" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_a3422826753d4e6b079dea98342"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "model"`);
    }

}
