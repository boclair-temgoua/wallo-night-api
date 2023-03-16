import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1678988816304 implements MigrationInterface {
    name = 'Migrations1678988816304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."contributor_type_enum" AS ENUM('ORGANIZATION')`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD "type" "public"."contributor_type_enum" NOT NULL DEFAULT 'ORGANIZATION'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contributor" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."contributor_type_enum"`);
    }

}
