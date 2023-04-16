import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1681605841126 implements MigrationInterface {
    name = 'Migration1681605841126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" ADD "otherPhone" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "otherPhone"`);
    }

}
