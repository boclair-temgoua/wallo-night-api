import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698799256252 implements MigrationInterface {
    name = 'Migration1698799256252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_status_enum" AS ENUM('ACTIVE', 'PENDING', 'INVALID')`);
        await queryRunner.query(`CREATE TABLE "payment" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "firstName" character varying, "lastName" character varying, "phoneNumber" character varying, "status" "public"."payment_status_enum" NOT NULL DEFAULT 'PENDING', "cardName" character varying, "cardNumber" character varying, "cardExpMonth" character varying, "cardExpYear" character varying, "cardCvc" character varying, "type" character varying NOT NULL DEFAULT 'CARD', "description" text, "userId" uuid, "organizationId" uuid, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_b046318e0b341a7f72110b75857" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_be7fcc9fb8cd5a74cb602ec6c9b" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_be7fcc9fb8cd5a74cb602ec6c9b"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_b046318e0b341a7f72110b75857"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
    }

}
