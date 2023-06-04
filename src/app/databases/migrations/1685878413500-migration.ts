import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1685878413500 implements MigrationInterface {
    name = 'Migration1685878413500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "discount" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "description" character varying, "percent" double precision NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "expiredAt" TIMESTAMP WITH TIME ZONE, "startedAt" TIMESTAMP WITH TIME ZONE, "organizationId" uuid, CONSTRAINT "PK_d05d8712e429673e459e7f1cddb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "discountId"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "discountId" uuid`);
        await queryRunner.query(`ALTER TABLE "discount" ADD CONSTRAINT "FK_6fcb91339ad8937a414e7963641" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_1e0bf1305eddcd6627b4a32a6c6" FOREIGN KEY ("discountId") REFERENCES "discount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_1e0bf1305eddcd6627b4a32a6c6"`);
        await queryRunner.query(`ALTER TABLE "discount" DROP CONSTRAINT "FK_6fcb91339ad8937a414e7963641"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "discountId"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "discountId" bigint`);
        await queryRunner.query(`DROP TABLE "discount"`);
    }

}
