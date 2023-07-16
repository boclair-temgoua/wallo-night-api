import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1689542455419 implements MigrationInterface {
    name = 'Migration1689542455419'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investment" ADD "currencyId" uuid`);
        await queryRunner.query(`ALTER TABLE "investment" ADD CONSTRAINT "FK_f6f14ab2f59fb03d221bc288e8e" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investment" DROP CONSTRAINT "FK_f6f14ab2f59fb03d221bc288e8e"`);
        await queryRunner.query(`ALTER TABLE "investment" DROP COLUMN "currencyId"`);
    }

}
