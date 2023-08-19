import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692451260659 implements MigrationInterface {
    name = 'Migration1692451260659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "parentId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "parentId"`);
    }

}
