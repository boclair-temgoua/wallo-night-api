import { MigrationInterface, QueryRunner } from "typeorm";

export class document1680427260783 implements MigrationInterface {
    name = 'document1680427260783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "document" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "organizationId" uuid, "projectId" uuid, "subProjectId" uuid, CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "document" ADD CONSTRAINT "FK_dfcea06c9f090a968a8076dccb5" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document" ADD CONSTRAINT "FK_1609339df21e7616eb9ce3dec47" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document" ADD CONSTRAINT "FK_dff00b8231e5405664aeba22422" FOREIGN KEY ("subProjectId") REFERENCES "sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" DROP CONSTRAINT "FK_dff00b8231e5405664aeba22422"`);
        await queryRunner.query(`ALTER TABLE "document" DROP CONSTRAINT "FK_1609339df21e7616eb9ce3dec47"`);
        await queryRunner.query(`ALTER TABLE "document" DROP CONSTRAINT "FK_dfcea06c9f090a968a8076dccb5"`);
        await queryRunner.query(`DROP TABLE "document"`);
    }

}
