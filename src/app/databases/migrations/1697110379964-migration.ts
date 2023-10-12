import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1697110379964 implements MigrationInterface {
    name = 'Migration1697110379964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "permission" character varying DEFAULT 'USER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "permission"`);
    }

}
