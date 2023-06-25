import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1687658356693 implements MigrationInterface {
    name = 'Migration1687658356693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "donation" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying, "isActive" boolean NOT NULL DEFAULT true, "expiredAt" TIMESTAMP WITH TIME ZONE, "amount" double precision NOT NULL, "title" character varying, "description" character varying, "currencyId" uuid, "userId" uuid, "organizationId" uuid, CONSTRAINT "PK_25fb5a541964bc5cfc18fb13a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "donation" ADD CONSTRAINT "FK_c1ddcf1988ed8c5c19142ec4099" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "donation" ADD CONSTRAINT "FK_063499388657e648418470a439a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "donation" ADD CONSTRAINT "FK_2269fc6a81599c54ff9f3392e03" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation" DROP CONSTRAINT "FK_2269fc6a81599c54ff9f3392e03"`);
        await queryRunner.query(`ALTER TABLE "donation" DROP CONSTRAINT "FK_063499388657e648418470a439a"`);
        await queryRunner.query(`ALTER TABLE "donation" DROP CONSTRAINT "FK_c1ddcf1988ed8c5c19142ec4099"`);
        await queryRunner.query(`DROP TABLE "donation"`);
    }

}
