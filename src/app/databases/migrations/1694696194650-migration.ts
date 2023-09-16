import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694696194650 implements MigrationInterface {
    name = 'Migration1694696194650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_9831a04b59c0a96ccb9dfd431d7"`);
        await queryRunner.query(`ALTER TABLE "transaction" RENAME COLUMN "membershipId" TO "subscribeId"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_61a77de7e0fce82a038d90ffc3f" FOREIGN KEY ("subscribeId") REFERENCES "subscribe"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_61a77de7e0fce82a038d90ffc3f"`);
        await queryRunner.query(`ALTER TABLE "transaction" RENAME COLUMN "subscribeId" TO "membershipId"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_9831a04b59c0a96ccb9dfd431d7" FOREIGN KEY ("membershipId") REFERENCES "membership"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
