import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1681047432873 implements MigrationInterface {
    name = 'Migration1681047432873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."contributor_role_enum" RENAME TO "contributor_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."contributor_role_enum" AS ENUM('ADMIN', 'MODERATOR', 'EDITOR', 'GHOST', 'ANALYST')`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "role" TYPE "public"."contributor_role_enum" USING "role"::"text"::"public"."contributor_role_enum"`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "role" SET DEFAULT 'ADMIN'`);
        await queryRunner.query(`DROP TYPE "public"."contributor_role_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."contributor_role_enum_old" AS ENUM('ADMIN', 'MODERATOR', 'EDITOR', 'GHOST')`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "role" TYPE "public"."contributor_role_enum_old" USING "role"::"text"::"public"."contributor_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "contributor" ALTER COLUMN "role" SET DEFAULT 'ADMIN'`);
        await queryRunner.query(`DROP TYPE "public"."contributor_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."contributor_role_enum_old" RENAME TO "contributor_role_enum"`);
    }

}
