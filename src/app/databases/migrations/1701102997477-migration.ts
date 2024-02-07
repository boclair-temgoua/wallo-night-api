import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1701102997477 implements MigrationInterface {
  name = 'Migration1701102997477';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth_provider" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "email" character varying, "providerId" character varying, "userId" uuid, CONSTRAINT "PK_0a6e6348fe38ba49160eb903c95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_provider" ADD CONSTRAINT "FK_d9255ec09fddab3e47e84fd2a07" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth_provider" DROP CONSTRAINT "FK_d9255ec09fddab3e47e84fd2a07"`,
    );
    await queryRunner.query(`DROP TABLE "auth_provider"`);
  }
}
