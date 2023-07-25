import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1690319139263 implements MigrationInterface {
    name = 'Migration1690319139263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."withdrawal_type_enum" AS ENUM('PAYPAL', 'CARD', 'COUPON', 'PHONE')`);
        await queryRunner.query(`CREATE TABLE "withdrawal" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" double precision, "title" character varying, "email" character varying, "iban" character varying, "phone" character varying, "confirmedAt" TIMESTAMP WITH TIME ZONE, "description" character varying, "type" "public"."withdrawal_type_enum" NOT NULL DEFAULT 'CARD', "userId" uuid, "organizationId" uuid, CONSTRAINT "PK_840e247aaad3fbd4e18129122a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "withdrawalId" uuid`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_type_enum" RENAME TO "transaction_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum" AS ENUM('PAYPAL', 'CARD', 'COUPON', 'PHONE')`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "type" TYPE "public"."transaction_type_enum" USING "type"::"text"::"public"."transaction_type_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "type" SET DEFAULT 'CARD'`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD CONSTRAINT "FK_6eb34227c6d10e54e2d0d3f575f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD CONSTRAINT "FK_8b33f88f786cf4a66d54ab4b2a5" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_ed0f4da5916ed6948bd4d81e8a0" FOREIGN KEY ("withdrawalId") REFERENCES "withdrawal"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_ed0f4da5916ed6948bd4d81e8a0"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP CONSTRAINT "FK_8b33f88f786cf4a66d54ab4b2a5"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP CONSTRAINT "FK_6eb34227c6d10e54e2d0d3f575f"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum_old" AS ENUM('PAYPAL', 'CARD', 'COUPON')`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "type" TYPE "public"."transaction_type_enum_old" USING "type"::"text"::"public"."transaction_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "type" SET DEFAULT 'CARD'`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_type_enum_old" RENAME TO "transaction_type_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "withdrawalId"`);
        await queryRunner.query(`DROP TABLE "withdrawal"`);
        await queryRunner.query(`DROP TYPE "public"."withdrawal_type_enum"`);
    }

}
