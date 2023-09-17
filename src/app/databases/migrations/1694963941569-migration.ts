import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694963941569 implements MigrationInterface {
    name = 'Migration1694963941569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_ec56d42527f43b78a5272d431c0" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_ec56d42527f43b78a5272d431c0"`);
    }

}
