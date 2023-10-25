import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698270016110 implements MigrationInterface {
    name = 'Migration1698270016110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "fullName" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "email" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "fullName"`);
    }

}
