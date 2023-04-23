import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1682274868624 implements MigrationInterface {
    name = 'Migration1682274868624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "group" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying, "name" character varying, "description" character varying, "color" character varying, "image" character varying, "userId" uuid, "userCreatedId" uuid, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_7bec24423f57c3786409cc3cc8d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_7bec24423f57c3786409cc3cc8d"`);
        await queryRunner.query(`DROP TABLE "group"`);
    }

}
