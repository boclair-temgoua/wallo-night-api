import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1707238269552 implements MigrationInterface {
    name = 'Migration1707238269552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_order" ADD CONSTRAINT "FK_52abc6c6e8cb9e3b8f3a32c68c2" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_order" DROP CONSTRAINT "FK_52abc6c6e8cb9e3b8f3a32c68c2"`);
    }

}
