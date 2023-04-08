import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1680927666168 implements MigrationInterface {
    name = 'Migration1680927666168'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sub_sub_project" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying, "name" text, "description" character varying, "color" character varying, "image" character varying, "userCreatedId" uuid, "subProjectId" uuid, CONSTRAINT "PK_79fda710382a3041149daf3b823" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "document" ADD "subSubProjectId" uuid`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD "subSubProjectId" uuid`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "subSubProjectId" uuid`);
        await queryRunner.query(`ALTER TABLE "sub_sub_project" ADD CONSTRAINT "FK_c8af74749bdc78b1211113d0e9e" FOREIGN KEY ("subProjectId") REFERENCES "sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document" ADD CONSTRAINT "FK_e547a0a1e1c19b4c90e8bfb562e" FOREIGN KEY ("subSubProjectId") REFERENCES "sub_sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD CONSTRAINT "FK_d3660e2f5165a06441ab5e1578b" FOREIGN KEY ("subSubProjectId") REFERENCES "sub_sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_2d23ca1f0890357781c9eed7544" FOREIGN KEY ("subSubProjectId") REFERENCES "sub_sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_2d23ca1f0890357781c9eed7544"`);
        await queryRunner.query(`ALTER TABLE "contributor" DROP CONSTRAINT "FK_d3660e2f5165a06441ab5e1578b"`);
        await queryRunner.query(`ALTER TABLE "document" DROP CONSTRAINT "FK_e547a0a1e1c19b4c90e8bfb562e"`);
        await queryRunner.query(`ALTER TABLE "sub_sub_project" DROP CONSTRAINT "FK_c8af74749bdc78b1211113d0e9e"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "subSubProjectId"`);
        await queryRunner.query(`ALTER TABLE "contributor" DROP COLUMN "subSubProjectId"`);
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "subSubProjectId"`);
        await queryRunner.query(`DROP TABLE "sub_sub_project"`);
    }

}
