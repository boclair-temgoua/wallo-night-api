import { MigrationInterface, QueryRunner } from "typeorm";

export class User1680185407728 implements MigrationInterface {
    name = 'User1680185407728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "noHashPassword"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "noHashPassword" character varying`);
    }

}
