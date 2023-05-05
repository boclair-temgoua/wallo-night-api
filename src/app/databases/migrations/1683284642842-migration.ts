import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1683284642842 implements MigrationInterface {
    name = 'Migration1683284642842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "phone" character varying, "email" character varying, "firstAddress" character varying, "secondAddress" character varying, "requiresPayment" boolean NOT NULL DEFAULT false, "color" character varying, "image" character varying, "userId" uuid, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_5334a80199f7cbe3e014c1768c7" FOREIGN KEY ("organizationInUtilizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_b0d30285f6775593196167e2016" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_b0d30285f6775593196167e2016"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5334a80199f7cbe3e014c1768c7"`);
        await queryRunner.query(`DROP TABLE "organization"`);
    }

}
