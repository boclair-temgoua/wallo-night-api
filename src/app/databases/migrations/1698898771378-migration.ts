import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698898771378 implements MigrationInterface {
    name = 'Migration1698898771378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_action_enum" AS ENUM('PAYMENT', 'WITHDRAWING')`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "action" "public"."payment_action_enum" NOT NULL DEFAULT 'PAYMENT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "action"`);
        await queryRunner.query(`DROP TYPE "public"."payment_action_enum"`);
    }

}
