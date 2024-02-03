import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1706891036004 implements MigrationInterface {
    name = 'Migration1706891036004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commission" ADD "discountId" uuid`);
        await queryRunner.query(`ALTER TABLE "commission" ADD CONSTRAINT "FK_30eb5a88f6e0ce0cad91bebd899" FOREIGN KEY ("discountId") REFERENCES "discount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commission" DROP CONSTRAINT "FK_30eb5a88f6e0ce0cad91bebd899"`);
        await queryRunner.query(`ALTER TABLE "commission" DROP COLUMN "discountId"`);
    }

}
