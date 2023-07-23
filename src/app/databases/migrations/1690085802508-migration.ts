import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1690085802508 implements MigrationInterface {
    name = 'Migration1690085802508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "gift" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "expiredAt" TIMESTAMP WITH TIME ZONE, "title" character varying, "image" character varying, "description" character varying, "amount" bigint NOT NULL, "currencyId" uuid, "userId" uuid, "organizationId" uuid, CONSTRAINT "PK_f91217caddc01a085837ebe0606" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "giftId" uuid`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD "giftId" uuid`);
        await queryRunner.query(`ALTER TABLE "donation" ADD "image" character varying`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "amount" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "UQ_35472b1fe48b6330cd349709564" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "gift" ADD CONSTRAINT "FK_68ec6573da55ecf00dd0bdddcd4" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gift" ADD CONSTRAINT "FK_f7a55bd23f1651967522262f50f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gift" ADD CONSTRAINT "FK_594c86139f5aa1acac9d692ba8e" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_8e50cf45135c794a78ad18db6c5" FOREIGN KEY ("giftId") REFERENCES "gift"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD CONSTRAINT "FK_d673c807f6c5927985d5d1723c3" FOREIGN KEY ("giftId") REFERENCES "gift"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"`);
        await queryRunner.query(`ALTER TABLE "contributor" DROP CONSTRAINT "FK_d673c807f6c5927985d5d1723c3"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_8e50cf45135c794a78ad18db6c5"`);
        await queryRunner.query(`ALTER TABLE "gift" DROP CONSTRAINT "FK_594c86139f5aa1acac9d692ba8e"`);
        await queryRunner.query(`ALTER TABLE "gift" DROP CONSTRAINT "FK_f7a55bd23f1651967522262f50f"`);
        await queryRunner.query(`ALTER TABLE "gift" DROP CONSTRAINT "FK_68ec6573da55ecf00dd0bdddcd4"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "UQ_35472b1fe48b6330cd349709564"`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "amount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "donation" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "contributor" DROP COLUMN "giftId"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "giftId"`);
        await queryRunner.query(`DROP TABLE "gift"`);
    }

}
