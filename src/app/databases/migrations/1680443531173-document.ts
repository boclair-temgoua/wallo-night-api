import { MigrationInterface, QueryRunner } from "typeorm";

export class document1680443531173 implements MigrationInterface {
    name = 'document1680443531173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."document_type_enum" AS ENUM('ORGANIZATION', 'PROJECT', 'SUBPROJECT')`);
        await queryRunner.query(`ALTER TABLE "document" ADD "type" "public"."document_type_enum" NOT NULL DEFAULT 'ORGANIZATION'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."document_type_enum"`);
        await queryRunner.query(`ALTER TABLE "document" ADD "type" character varying`);
    }

}
