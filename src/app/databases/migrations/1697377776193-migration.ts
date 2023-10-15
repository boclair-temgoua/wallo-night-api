import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1697377776193 implements MigrationInterface {
    name = 'Migration1697377776193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscribe" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "subscribe" ADD CONSTRAINT "FK_d72cff242225704046552c5be35" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscribe" DROP CONSTRAINT "FK_d72cff242225704046552c5be35"`);
        await queryRunner.query(`ALTER TABLE "subscribe" DROP COLUMN "organizationId"`);
    }

}
