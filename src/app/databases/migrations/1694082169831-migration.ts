import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694082169831 implements MigrationInterface {
    name = 'Migration1694082169831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "commission" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "slug" character varying, "image" character varying, "urlMedia" character varying, "price" bigint NOT NULL DEFAULT '0', "description" text, "messageAfterPurchase" text, "status" character varying NOT NULL DEFAULT 'ACTIVE', "currencyId" uuid, "userId" uuid, CONSTRAINT "UQ_d199b420a190ee860a4d8ab802a" UNIQUE ("slug"), CONSTRAINT "PK_d108d70411783e2a3a84e386601" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "commission" ADD CONSTRAINT "FK_acc96be68db703cd47ded4d71cf" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commission" ADD CONSTRAINT "FK_4dfe2bcf248c3d8ee0e4b5743e3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commission" DROP CONSTRAINT "FK_4dfe2bcf248c3d8ee0e4b5743e3"`);
        await queryRunner.query(`ALTER TABLE "commission" DROP CONSTRAINT "FK_acc96be68db703cd47ded4d71cf"`);
        await queryRunner.query(`DROP TABLE "commission"`);
    }

}
