import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1685870906869 implements MigrationInterface {
    name = 'Migration1685870906869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."cart_status_enum" AS ENUM('ADDED', 'COMPLETED')`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "status" "public"."cart_status_enum" NOT NULL DEFAULT 'ADDED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."cart_status_enum"`);
    }

}
