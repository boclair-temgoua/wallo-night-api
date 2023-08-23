import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692730598453 implements MigrationInterface {
    name = 'Migration1692730598453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."contributor_type_enum" RENAME TO "contributor_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."contributor_type_enum" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'MEMBERSHIP', 'GIFT', 'HELP', 'ARTICLE', 'GALLERY', 'COMMENT')`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" TYPE "public"."contributor_type_enum" USING "type"::"text"::"public"."contributor_type_enum"`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" SET DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`DROP TYPE "public"."contributor_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."like_type_enum" RENAME TO "like_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."like_type_enum" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'MEMBERSHIP', 'GIFT', 'HELP', 'ARTICLE', 'GALLERY', 'COMMENT')`);
        await queryRunner.query(`ALTER TABLE "like" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "like" ALTER COLUMN "type" TYPE "public"."like_type_enum" USING "type"::"text"::"public"."like_type_enum"`);
        await queryRunner.query(`ALTER TABLE "like" ALTER COLUMN "type" SET DEFAULT 'COMMENT'`);
        await queryRunner.query(`DROP TYPE "public"."like_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."like_type_enum_old" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'MEMBERSHIP', 'GIFT', 'HELP', 'POST', 'GALLERY', 'COMMENT')`);
        await queryRunner.query(`ALTER TABLE "like" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "like" ALTER COLUMN "type" TYPE "public"."like_type_enum_old" USING "type"::"text"::"public"."like_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "like" ALTER COLUMN "type" SET DEFAULT 'COMMENT'`);
        await queryRunner.query(`DROP TYPE "public"."like_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."like_type_enum_old" RENAME TO "like_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."contributor_type_enum_old" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'MEMBERSHIP', 'GIFT', 'HELP', 'POST', 'GALLERY', 'COMMENT')`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" TYPE "public"."contributor_type_enum_old" USING "type"::"text"::"public"."contributor_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "type" SET DEFAULT 'ORGANIZATION'`);
        await queryRunner.query(`DROP TYPE "public"."contributor_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."contributor_type_enum_old" RENAME TO "contributor_type_enum"`);
    }

}
