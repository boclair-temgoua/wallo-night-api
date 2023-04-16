import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1681642335661 implements MigrationInterface {
    name = 'Migration1681642335661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_22250e34adcb0b4bb5e2ce9142f"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_2d23ca1f0890357781c9eed7544"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_7598ca9cadd9bc8c27f4f6e918a"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_2c814094361b215f3bd4d11d0c9"`);
        await queryRunner.query(`CREATE TYPE "public"."contact_project_type_enum" AS ENUM('ORGANIZATION', 'PROJECT', 'SUBPROJECT', 'SUBSUBPROJECT', 'SUBSUBSUBPROJECT')`);
        await queryRunner.query(`CREATE TABLE "contact_project" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."contact_project_type_enum" NOT NULL DEFAULT 'ORGANIZATION', "contactId" uuid, "organizationId" uuid, "projectId" uuid, "subProjectId" uuid, "subSubProjectId" uuid, "subSubSubProjectId" uuid, "userCreatedId" uuid, CONSTRAINT "PK_650058e951faf9a9849cc861e79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."contact_type_enum"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "subProjectId"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "subSubProjectId"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "subSubSubProjectId"`);
        await queryRunner.query(`ALTER TABLE "contact_project" ADD CONSTRAINT "FK_9774a3c61d1ca6ef50384a42d43" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_project" ADD CONSTRAINT "FK_4e2df72bec1b6f729cee4437036" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_project" ADD CONSTRAINT "FK_c88dce296d15efef69372b837c6" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_project" ADD CONSTRAINT "FK_31e8b4cf5956f89a75b217151ad" FOREIGN KEY ("subProjectId") REFERENCES "sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_project" ADD CONSTRAINT "FK_6e39aa64f5ddc4d686d435362c3" FOREIGN KEY ("subSubProjectId") REFERENCES "sub_sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_project" ADD CONSTRAINT "FK_57f291ceae26e4775baa4507384" FOREIGN KEY ("subSubSubProjectId") REFERENCES "sub_sub_sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_project" DROP CONSTRAINT "FK_57f291ceae26e4775baa4507384"`);
        await queryRunner.query(`ALTER TABLE "contact_project" DROP CONSTRAINT "FK_6e39aa64f5ddc4d686d435362c3"`);
        await queryRunner.query(`ALTER TABLE "contact_project" DROP CONSTRAINT "FK_31e8b4cf5956f89a75b217151ad"`);
        await queryRunner.query(`ALTER TABLE "contact_project" DROP CONSTRAINT "FK_c88dce296d15efef69372b837c6"`);
        await queryRunner.query(`ALTER TABLE "contact_project" DROP CONSTRAINT "FK_4e2df72bec1b6f729cee4437036"`);
        await queryRunner.query(`ALTER TABLE "contact_project" DROP CONSTRAINT "FK_9774a3c61d1ca6ef50384a42d43"`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "subSubSubProjectId" uuid`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "subSubProjectId" uuid`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "subProjectId" uuid`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "projectId" uuid`);
        await queryRunner.query(`CREATE TYPE "public"."contact_type_enum" AS ENUM('ORGANIZATION', 'PROJECT', 'SUBPROJECT', 'SUBSUBPROJECT', 'SUBSUBSUBPROJECT')`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "type" "public"."contact_type_enum" NOT NULL DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`DROP TABLE "contact_project"`);
        await queryRunner.query(`DROP TYPE "public"."contact_project_type_enum"`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_2c814094361b215f3bd4d11d0c9" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_7598ca9cadd9bc8c27f4f6e918a" FOREIGN KEY ("subProjectId") REFERENCES "sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_2d23ca1f0890357781c9eed7544" FOREIGN KEY ("subSubProjectId") REFERENCES "sub_sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_22250e34adcb0b4bb5e2ce9142f" FOREIGN KEY ("subSubSubProjectId") REFERENCES "sub_sub_sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
