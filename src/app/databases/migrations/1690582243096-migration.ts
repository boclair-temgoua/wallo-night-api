import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1690582243096 implements MigrationInterface {
    name = 'Migration1690582243096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_stepregister_enum" AS ENUM('EMAIL_CREATE', 'USERNAME_CREATE', 'CONFIRM_EMAIL')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "stepRegister" "public"."user_stepregister_enum" NOT NULL DEFAULT 'EMAIL_CREATE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "stepRegister"`);
        await queryRunner.query(`DROP TYPE "public"."user_stepregister_enum"`);
    }

}
