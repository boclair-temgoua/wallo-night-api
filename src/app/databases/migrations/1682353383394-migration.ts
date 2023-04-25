import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1682353383394 implements MigrationInterface {
    name = 'Migration1682353383394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "title"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "title" character varying`);
    }

}
