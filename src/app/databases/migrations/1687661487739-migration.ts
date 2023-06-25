import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1687661487739 implements MigrationInterface {
    name = 'Migration1687661487739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "donationId" uuid`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_13ffb77adf62d91bbc297bcd167" FOREIGN KEY ("donationId") REFERENCES "donation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_13ffb77adf62d91bbc297bcd167"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "donationId"`);
    }

}
