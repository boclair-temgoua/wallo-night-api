import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1707744836593 implements MigrationInterface {
    name = 'Migration1707744836593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "orderId" uuid`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "UQ_a6e45c89cfbe8d92840266fd30f" UNIQUE ("orderId")`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_a6e45c89cfbe8d92840266fd30f" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_a6e45c89cfbe8d92840266fd30f"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "UQ_a6e45c89cfbe8d92840266fd30f"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "orderId"`);
    }

}
