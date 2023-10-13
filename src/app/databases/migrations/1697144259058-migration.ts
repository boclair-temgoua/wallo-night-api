import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1697144259058 implements MigrationInterface {
    name = 'Migration1697144259058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_event" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying, "status" character varying NOT NULL DEFAULT 'ACTIVE', "transactionId" character varying, "userConfirmedId" character varying, "organizationId" character varying, "ourEventId" uuid, "userId" uuid, CONSTRAINT "PK_394b0d7613180ebee9028e9aaa1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_event" ADD CONSTRAINT "FK_bd5990a2be443eb763a3a7d5b5c" FOREIGN KEY ("ourEventId") REFERENCES "our_event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_event" ADD CONSTRAINT "FK_03748d45cb1517ea4156fa8476f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_event" DROP CONSTRAINT "FK_03748d45cb1517ea4156fa8476f"`);
        await queryRunner.query(`ALTER TABLE "order_event" DROP CONSTRAINT "FK_bd5990a2be443eb763a3a7d5b5c"`);
        await queryRunner.query(`DROP TABLE "order_event"`);
    }

}
