import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1706696480261 implements MigrationInterface {
    name = 'Migration1706696480261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "commissionId" uuid`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_5dad9b79315d5cd2054d6e5fd69" FOREIGN KEY ("commissionId") REFERENCES "commission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_5dad9b79315d5cd2054d6e5fd69"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "commissionId"`);
    }

}
