import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1690245462644 implements MigrationInterface {
    name = 'Migration1690245462644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."contribution_type_enum" RENAME TO "contribution_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."contribution_type_enum" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'GIFT', 'HELP')`);
        await queryRunner.query(`ALTER TABLE "contribution" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contribution" ALTER COLUMN "type" TYPE "public"."contribution_type_enum" USING "type"::"text"::"public"."contribution_type_enum"`);
        await queryRunner.query(`ALTER TABLE "contribution" ALTER COLUMN "type" SET DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`DROP TYPE "public"."contribution_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."contributor_type_enum" RENAME TO "contributor_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."contributor_type_enum" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'GIFT', 'HELP')`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" TYPE "public"."contributor_type_enum" USING "type"::"text"::"public"."contributor_type_enum"`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" SET DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`DROP TYPE "public"."contributor_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."contributor_type_enum_old" AS ENUM('ORGANIZATION', 'DONATION', 'GIFT', 'HELP')`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" TYPE "public"."contributor_type_enum_old" USING "type"::"text"::"public"."contributor_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" SET DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`DROP TYPE "public"."contributor_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."contributor_type_enum_old" RENAME TO "contributor_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."contribution_type_enum_old" AS ENUM('ORGANIZATION', 'DONATION', 'GIFT', 'HELP')`);
        await queryRunner.query(`ALTER TABLE "contribution" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contribution" ALTER COLUMN "type" TYPE "public"."contribution_type_enum_old" USING "type"::"text"::"public"."contribution_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "contribution" ALTER COLUMN "type" SET DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`DROP TYPE "public"."contribution_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."contribution_type_enum_old" RENAME TO "contribution_type_enum"`);
    }

}
