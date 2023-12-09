import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1702037166053 implements MigrationInterface {
    name = 'Migration1702037166053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_ed0f4da5916ed6948bd4d81e8a0"`);
        await queryRunner.query(`CREATE TABLE "album" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "slug" character varying, "description" text, "userId" character varying, "organizationId" uuid, CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "withdrawalId"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "albumId" uuid`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_aa5660af9d9181fc693e4bfc8c8" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_aa5660af9d9181fc693e4bfc8c8"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "albumId"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "withdrawalId" uuid`);
        await queryRunner.query(`DROP TABLE "album"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_ed0f4da5916ed6948bd4d81e8a0" FOREIGN KEY ("withdrawalId") REFERENCES "withdrawal"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
