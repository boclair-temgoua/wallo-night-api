import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1682452508961 implements MigrationInterface {
    name = 'Migration1682452508961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "firstAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "secondAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "birthday" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "firstAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "secondAddress" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "secondAddress"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "firstAddress"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "birthday"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "secondAddress"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "firstAddress"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "phone"`);
    }

}
