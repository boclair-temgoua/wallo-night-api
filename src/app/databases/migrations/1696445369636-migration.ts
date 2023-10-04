import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1696445369636 implements MigrationInterface {
    name = 'Migration1696445369636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "our_event" ADD "address" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "our_event" DROP COLUMN "address"`);
    }

}
