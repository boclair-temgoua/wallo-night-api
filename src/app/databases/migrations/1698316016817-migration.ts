import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698316016817 implements MigrationInterface {
    name = 'Migration1698316016817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "fullName" character varying`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "email" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "fullName"`);
    }

}
