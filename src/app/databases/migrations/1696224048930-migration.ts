import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1696224048930 implements MigrationInterface {
    name = 'Migration1696224048930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "expiredAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "event" ADD "dateEvent" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "dateEvent"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "expiredAt"`);
    }

}
