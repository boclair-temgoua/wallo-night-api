import { MigrationInterface, QueryRunner } from "typeorm";

export class project1680382557195 implements MigrationInterface {
    name = 'project1680382557195'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sub_project" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text, "description" character varying, "color" character varying, "userCreatedId" uuid, "projectId" uuid, "organizationId" uuid, CONSTRAINT "PK_191b38c3d2b144ed95201ec562f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sub_project" ADD CONSTRAINT "FK_0703c4f89101a2440d2a5a71dfb" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_project" ADD CONSTRAINT "FK_5d2ea436fae662aeba9329b9904" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_project" DROP CONSTRAINT "FK_5d2ea436fae662aeba9329b9904"`);
        await queryRunner.query(`ALTER TABLE "sub_project" DROP CONSTRAINT "FK_0703c4f89101a2440d2a5a71dfb"`);
        await queryRunner.query(`DROP TABLE "sub_project"`);
    }

}
