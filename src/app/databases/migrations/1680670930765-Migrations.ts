import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1680670930765 implements MigrationInterface {
    name = 'Migrations1680670930765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "color" character varying, "image" character varying, "countryId" integer, "description" text, "userCreatedId" uuid, "organizationId" uuid, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "categoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_e622399a6d565cafb9c754f093d" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_8f5c148ea02e29e8fd05b3884a8" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_8f5c148ea02e29e8fd05b3884a8"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_e622399a6d565cafb9c754f093d"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "categoryId"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
