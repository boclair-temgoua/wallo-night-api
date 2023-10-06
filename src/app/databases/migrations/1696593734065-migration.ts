import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1696593734065 implements MigrationInterface {
    name = 'Migration1696593734065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "firstAddress" character varying, "secondAddress" character varying, "color" character varying, "image" character varying, "userId" uuid, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "gift" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "post" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "contribution" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "discount" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "product" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "commission" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "project" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD "organizationId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaign" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "commission" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "contributor" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "discount" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "contribution" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "gift" DROP COLUMN "organizationId"`);
        await queryRunner.query(`DROP TABLE "organization"`);
    }

}
