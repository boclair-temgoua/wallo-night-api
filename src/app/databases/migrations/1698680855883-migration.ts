import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698680855883 implements MigrationInterface {
    name = 'Migration1698680855883'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation" RENAME COLUMN "amount" TO "price"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation" RENAME COLUMN "price" TO "amount"`);
    }

}
