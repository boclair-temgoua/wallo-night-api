import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1710005715769 implements MigrationInterface {
    name = 'Migration1710005715769'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_54fceddb58a26773e187f80200c"`);
        await queryRunner.query(`ALTER TABLE "transaction" RENAME COLUMN "userSendId" TO "userBuyerId"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_d48db7354a215d5cf5a6888e894" FOREIGN KEY ("userBuyerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_d48db7354a215d5cf5a6888e894"`);
        await queryRunner.query(`ALTER TABLE "transaction" RENAME COLUMN "userBuyerId" TO "userSendId"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_54fceddb58a26773e187f80200c" FOREIGN KEY ("userSendId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
