import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698680260392 implements MigrationInterface {
    name = 'Migration1698680260392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "donation" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "amount" double precision NOT NULL, "description" text, "messageWelcome" text, "userId" uuid, CONSTRAINT "REL_063499388657e648418470a439" UNIQUE ("userId"), CONSTRAINT "PK_25fb5a541964bc5cfc18fb13a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "gift" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "gift" ADD "amount" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "donation" ADD CONSTRAINT "FK_063499388657e648418470a439a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation" DROP CONSTRAINT "FK_063499388657e648418470a439a"`);
        await queryRunner.query(`ALTER TABLE "gift" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "gift" ADD "amount" bigint NOT NULL`);
        await queryRunner.query(`DROP TABLE "donation"`);
    }

}
