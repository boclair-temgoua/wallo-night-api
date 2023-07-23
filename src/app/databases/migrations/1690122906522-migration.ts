import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1690122906522 implements MigrationInterface {
    name = 'Migration1690122906522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contributor" DROP CONSTRAINT "FK_d673c807f6c5927985d5d1723c3"`);
        await queryRunner.query(`ALTER TABLE "contributor" DROP CONSTRAINT "FK_0ecab64cb24d2e632fe8ccd1648"`);
        await queryRunner.query(`CREATE TYPE "public"."contribution_type_enum" AS ENUM('ORGANIZATION', 'DONATION', 'GIFT', 'HELP')`);
        await queryRunner.query(`CREATE TABLE "contribution" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" bigint, "type" "public"."contribution_type_enum" NOT NULL DEFAULT 'ORGANIZATION', "userId" uuid, "organizationId" uuid, "donationId" uuid, "giftId" uuid, CONSTRAINT "PK_878330fa5bb34475732a5883d58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contributor" DROP COLUMN "donationId"`);
        await queryRunner.query(`ALTER TABLE "contributor" DROP COLUMN "giftId"`);
        await queryRunner.query(`ALTER TABLE "currency" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TYPE "public"."contributor_type_enum" RENAME TO "contributor_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."contributor_type_enum" AS ENUM('ORGANIZATION', 'DONATION', 'GIFT', 'HELP')`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" TYPE "public"."contributor_type_enum" USING "type"::"text"::"public"."contributor_type_enum"`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" SET DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`DROP TYPE "public"."contributor_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "contribution" ADD CONSTRAINT "FK_d2084068d6246a419df6fec9d0f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contribution" ADD CONSTRAINT "FK_528d197608e895e0cf544e0b543" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contribution" ADD CONSTRAINT "FK_e1c2bc4138feb63a30efea71f55" FOREIGN KEY ("donationId") REFERENCES "donation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contribution" ADD CONSTRAINT "FK_1a142b8239500ddab2b4466f2e3" FOREIGN KEY ("giftId") REFERENCES "gift"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contribution" DROP CONSTRAINT "FK_1a142b8239500ddab2b4466f2e3"`);
        await queryRunner.query(`ALTER TABLE "contribution" DROP CONSTRAINT "FK_e1c2bc4138feb63a30efea71f55"`);
        await queryRunner.query(`ALTER TABLE "contribution" DROP CONSTRAINT "FK_528d197608e895e0cf544e0b543"`);
        await queryRunner.query(`ALTER TABLE "contribution" DROP CONSTRAINT "FK_d2084068d6246a419df6fec9d0f"`);
        await queryRunner.query(`CREATE TYPE "public"."contributor_type_enum_old" AS ENUM('ORGANIZATION', 'DONATION')`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" TYPE "public"."contributor_type_enum_old" USING "type"::"text"::"public"."contributor_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" SET DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`DROP TYPE "public"."contributor_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."contributor_type_enum_old" RENAME TO "contributor_type_enum"`);
        await queryRunner.query(`ALTER TABLE "currency" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD "giftId" uuid`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD "donationId" uuid`);
        await queryRunner.query(`DROP TABLE "contribution"`);
        await queryRunner.query(`DROP TYPE "public"."contribution_type_enum"`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD CONSTRAINT "FK_0ecab64cb24d2e632fe8ccd1648" FOREIGN KEY ("donationId") REFERENCES "donation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD CONSTRAINT "FK_d673c807f6c5927985d5d1723c3" FOREIGN KEY ("giftId") REFERENCES "gift"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
