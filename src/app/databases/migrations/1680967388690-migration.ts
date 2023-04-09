import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1680967388690 implements MigrationInterface {
    name = 'Migration1680967388690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sub_sub_sub_project" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying, "name" text, "description" character varying, "color" character varying, "image" character varying, "userCreatedId" uuid, "projectId" uuid, "organizationId" uuid, "subProjectId" uuid, "subSubProjectId" uuid, CONSTRAINT "PK_1fcd32ae0f8080460bcd3518db5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "subSubSubProjectId" uuid`);
        await queryRunner.query(`ALTER TABLE "document" ADD "subSubSubProjectId" uuid`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD "subSubSubProjectId" uuid`);
        await queryRunner.query(`ALTER TABLE "sub_sub_sub_project" ADD CONSTRAINT "FK_57549a11c7c9a35805827011d08" FOREIGN KEY ("subSubProjectId") REFERENCES "sub_sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_22250e34adcb0b4bb5e2ce9142f" FOREIGN KEY ("subSubSubProjectId") REFERENCES "sub_sub_sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document" ADD CONSTRAINT "FK_83b1811dc554872f3d1770007a1" FOREIGN KEY ("subSubSubProjectId") REFERENCES "sub_sub_sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD CONSTRAINT "FK_4229c5dcba28d543f22511470fd" FOREIGN KEY ("subSubSubProjectId") REFERENCES "sub_sub_sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contributor" DROP CONSTRAINT "FK_4229c5dcba28d543f22511470fd"`);
        await queryRunner.query(`ALTER TABLE "document" DROP CONSTRAINT "FK_83b1811dc554872f3d1770007a1"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_22250e34adcb0b4bb5e2ce9142f"`);
        await queryRunner.query(`ALTER TABLE "sub_sub_sub_project" DROP CONSTRAINT "FK_57549a11c7c9a35805827011d08"`);
        await queryRunner.query(`ALTER TABLE "contributor" DROP COLUMN "subSubSubProjectId"`);
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "subSubSubProjectId"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "subSubSubProjectId"`);
        await queryRunner.query(`DROP TABLE "sub_sub_sub_project"`);
    }

}
