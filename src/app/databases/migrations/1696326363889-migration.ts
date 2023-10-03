import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1696326363889 implements MigrationInterface {
    name = 'Migration1696326363889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "our_event" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "location" character varying, "requirement" character varying, "urlMedia" character varying, "slug" character varying, "urlRedirect" character varying, "enableUrlRedirect" boolean NOT NULL DEFAULT false, "price" bigint NOT NULL DEFAULT '0', "expiredAt" TIMESTAMP WITH TIME ZONE, "dateEvent" TIMESTAMP WITH TIME ZONE, "currency" character varying DEFAULT 'EUR', "description" text, "messageAfterPayment" text, "status" character varying NOT NULL DEFAULT 'ACTIVE', "userId" uuid, "organizationId" uuid, CONSTRAINT "UQ_3b1abb6e41d32b3d3f1a1ea0e66" UNIQUE ("slug"), CONSTRAINT "PK_92362f1afa38cc68754370a9b72" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "our_event" ADD CONSTRAINT "FK_7a4f92ce3265e02caca4350823f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "our_event" ADD CONSTRAINT "FK_1025793887dbdab339386c2a1ed" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "our_event" DROP CONSTRAINT "FK_1025793887dbdab339386c2a1ed"`);
        await queryRunner.query(`ALTER TABLE "our_event" DROP CONSTRAINT "FK_7a4f92ce3265e02caca4350823f"`);
        await queryRunner.query(`DROP TABLE "our_event"`);
    }

}
