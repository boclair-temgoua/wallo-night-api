import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1681058104982 implements MigrationInterface {
    name = 'Migration1681058104982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."contact_type_enum" RENAME TO "contact_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."contact_type_enum" AS ENUM('ORGANIZATION', 'PROJECT', 'SUBPROJECT', 'SUBSUBPROJECT', 'SUBSUBSUBPROJECT')`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "type" TYPE "public"."contact_type_enum" USING "type"::"text"::"public"."contact_type_enum"`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "type" SET DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`DROP TYPE "public"."contact_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."document_type_enum" RENAME TO "document_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."document_type_enum" AS ENUM('ORGANIZATION', 'PROJECT', 'SUBPROJECT', 'SUBSUBPROJECT', 'SUBSUBSUBPROJECT')`);
        await queryRunner.query(`ALTER TABLE "document" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "document" ALTER COLUMN "type" TYPE "public"."document_type_enum" USING "type"::"text"::"public"."document_type_enum"`);
        await queryRunner.query(`ALTER TABLE "document" ALTER COLUMN "type" SET DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`DROP TYPE "public"."document_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."contributor_type_enum" RENAME TO "contributor_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."contributor_type_enum" AS ENUM('ORGANIZATION', 'PROJECT', 'SUBPROJECT', 'SUBSUBPROJECT', 'SUBSUBSUBPROJECT')`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" TYPE "public"."contributor_type_enum" USING "type"::"text"::"public"."contributor_type_enum"`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" SET DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`DROP TYPE "public"."contributor_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."contributor_type_enum_old" AS ENUM('ORGANIZATION', 'PROJECT', 'SUBPROJECT', 'SUBSUBPROJECT')`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" TYPE "public"."contributor_type_enum_old" USING "type"::"text"::"public"."contributor_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" SET DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`DROP TYPE "public"."contributor_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."contributor_type_enum_old" RENAME TO "contributor_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."document_type_enum_old" AS ENUM('ORGANIZATION', 'PROJECT', 'SUBPROJECT', 'SUBSUBPROJECT')`);
        await queryRunner.query(`ALTER TABLE "document" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "document" ALTER COLUMN "type" TYPE "public"."document_type_enum_old" USING "type"::"text"::"public"."document_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "document" ALTER COLUMN "type" SET DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`DROP TYPE "public"."document_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."document_type_enum_old" RENAME TO "document_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."contact_type_enum_old" AS ENUM('ORGANIZATION', 'PROJECT', 'SUBPROJECT', 'SUBSUBPROJECT')`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "type" TYPE "public"."contact_type_enum_old" USING "type"::"text"::"public"."contact_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "type" SET DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`DROP TYPE "public"."contact_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."contact_type_enum_old" RENAME TO "contact_type_enum"`);
    }

}
