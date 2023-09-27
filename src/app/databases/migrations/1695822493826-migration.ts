import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1695822493826 implements MigrationInterface {
    name = 'Migration1695822493826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "membershipId" uuid`);
        await queryRunner.query(`ALTER TABLE "product" ADD "membershipId" uuid`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_8fb5ad5bcfc923e04dbb647c983" FOREIGN KEY ("membershipId") REFERENCES "membership"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_7c3ca9085af49db039fdeb2a6e8" FOREIGN KEY ("membershipId") REFERENCES "membership"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_7c3ca9085af49db039fdeb2a6e8"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_8fb5ad5bcfc923e04dbb647c983"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "membershipId"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "membershipId"`);
    }

}
