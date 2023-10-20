import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1697810996736 implements MigrationInterface {
    name = 'Migration1697810996736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_event" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "order_event" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "order_event" ADD CONSTRAINT "FK_0f9b0d83bc09f656717d1811f1e" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_event" DROP CONSTRAINT "FK_0f9b0d83bc09f656717d1811f1e"`);
        await queryRunner.query(`ALTER TABLE "order_event" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "order_event" ADD "organizationId" character varying`);
    }

}
