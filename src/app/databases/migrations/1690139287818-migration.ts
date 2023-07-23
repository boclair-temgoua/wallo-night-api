import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1690139287818 implements MigrationInterface {
    name = 'Migration1690139287818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum" AS ENUM('PAYPAL', 'CARD', 'COUPON')`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "type" "public"."transaction_type_enum" NOT NULL DEFAULT 'CARD'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
    }

}
