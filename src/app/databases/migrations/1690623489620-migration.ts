import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1690623489620 implements MigrationInterface {
    name = 'Migration1690623489620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."user_nextstep_enum" RENAME TO "user_nextstep_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_nextstep_enum" AS ENUM('CONFIRM_EMAIL', 'SETTING_PROFILE', 'SETTING_INTEREST', 'COMPLETE_REGISTRATION')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "nextStep" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "nextStep" TYPE "public"."user_nextstep_enum" USING "nextStep"::"text"::"public"."user_nextstep_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "nextStep" SET DEFAULT 'SETTING_PROFILE'`);
        await queryRunner.query(`DROP TYPE "public"."user_nextstep_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_nextstep_enum_old" AS ENUM('CONFIRM_EMAIL', 'SETTING_PROFILE', 'SETTING_INTEREST')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "nextStep" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "nextStep" TYPE "public"."user_nextstep_enum_old" USING "nextStep"::"text"::"public"."user_nextstep_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "nextStep" SET DEFAULT 'SETTING_PROFILE'`);
        await queryRunner.query(`DROP TYPE "public"."user_nextstep_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_nextstep_enum_old" RENAME TO "user_nextstep_enum"`);
    }

}
