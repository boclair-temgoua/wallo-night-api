import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698498828207 implements MigrationInterface {
    name = 'Migration1698498828207'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "userReceiveId" uuid`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_13c1566a315a3adfa91f2e09266" FOREIGN KEY ("userReceiveId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_13c1566a315a3adfa91f2e09266"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "userReceiveId"`);
    }

}
