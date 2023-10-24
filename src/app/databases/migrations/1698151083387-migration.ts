import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698151083387 implements MigrationInterface {
    name = 'Migration1698151083387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "FK_4c62c8a7ba2337d6d6ffcd8eb6d" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "FK_4c62c8a7ba2337d6d6ffcd8eb6d"`);
    }

}
