import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1689540484659 implements MigrationInterface {
    name = 'Migration1689540484659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "investment" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" double precision NOT NULL, "expiredAt" TIMESTAMP WITH TIME ZONE, "description" text, "token" text, "userCreatedId" uuid, "donationId" uuid, "userId" uuid, "organizationId" uuid, CONSTRAINT "PK_ad085a94bd56e031136925f681b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "investment" ADD CONSTRAINT "FK_274e907c000c6d3b19784d3dab9" FOREIGN KEY ("donationId") REFERENCES "donation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "investment" ADD CONSTRAINT "FK_e37ec642d341163666411eae841" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "investment" ADD CONSTRAINT "FK_b6c7268d41e85efdec79dab22a0" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investment" DROP CONSTRAINT "FK_b6c7268d41e85efdec79dab22a0"`);
        await queryRunner.query(`ALTER TABLE "investment" DROP CONSTRAINT "FK_e37ec642d341163666411eae841"`);
        await queryRunner.query(`ALTER TABLE "investment" DROP CONSTRAINT "FK_274e907c000c6d3b19784d3dab9"`);
        await queryRunner.query(`DROP TABLE "investment"`);
    }

}
