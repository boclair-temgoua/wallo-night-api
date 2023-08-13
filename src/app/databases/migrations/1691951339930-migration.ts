import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1691951339930 implements MigrationInterface {
    name = 'Migration1691951339930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "firstName" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "lastName" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "firstName"`);
    }

}
