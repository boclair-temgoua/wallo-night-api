import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1691443395385 implements MigrationInterface {
    name = 'Migration1691443395385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "membership" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "image" character varying, "description" text, "messageWelcome" text, "pricePerMonthly" double precision NOT NULL, "pricePerYearly" double precision NOT NULL, "currencyId" uuid, "userId" uuid, "organizationId" uuid, CONSTRAINT "PK_83c1afebef3059472e7c37e8de8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contribution" ADD "membershipId" uuid`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "membershipId" uuid`);
        await queryRunner.query(`ALTER TABLE "contribution" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."contribution_type_enum"`);
        await queryRunner.query(`ALTER TABLE "contribution" ADD "type" character varying(30) NOT NULL DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`ALTER TYPE "public"."contributor_type_enum" RENAME TO "contributor_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."contributor_type_enum" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'MEMBERSHIP', 'GIFT', 'HELP')`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" TYPE "public"."contributor_type_enum" USING "type"::"text"::"public"."contributor_type_enum"`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" SET DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`DROP TYPE "public"."contributor_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "FK_baffd07e4cc33cdafc223ba637c" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "FK_eef2d9d9c70cd13bed868afedf4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "FK_4c62c8a7ba2337d6d6ffcd8eb6d" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contribution" ADD CONSTRAINT "FK_91fe7a33779e1895a928f6f4676" FOREIGN KEY ("membershipId") REFERENCES "membership"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_9831a04b59c0a96ccb9dfd431d7" FOREIGN KEY ("membershipId") REFERENCES "membership"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_9831a04b59c0a96ccb9dfd431d7"`);
        await queryRunner.query(`ALTER TABLE "contribution" DROP CONSTRAINT "FK_91fe7a33779e1895a928f6f4676"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "FK_4c62c8a7ba2337d6d6ffcd8eb6d"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "FK_eef2d9d9c70cd13bed868afedf4"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "FK_baffd07e4cc33cdafc223ba637c"`);
        await queryRunner.query(`CREATE TYPE "public"."contributor_type_enum_old" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'GIFT', 'HELP')`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" TYPE "public"."contributor_type_enum_old" USING "type"::"text"::"public"."contributor_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" SET DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`DROP TYPE "public"."contributor_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."contributor_type_enum_old" RENAME TO "contributor_type_enum"`);
        await queryRunner.query(`ALTER TABLE "contribution" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."contribution_type_enum" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'GIFT', 'HELP')`);
        await queryRunner.query(`ALTER TABLE "contribution" ADD "type" "public"."contribution_type_enum" NOT NULL DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "membershipId"`);
        await queryRunner.query(`ALTER TABLE "contribution" DROP COLUMN "membershipId"`);
        await queryRunner.query(`DROP TABLE "membership"`);
    }

}
