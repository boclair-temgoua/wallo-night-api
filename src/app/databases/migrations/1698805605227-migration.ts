import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698805605227 implements MigrationInterface {
    name = 'Migration1698805605227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "cardName"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "fullName" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "cardExpMonth"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "cardExpMonth" integer`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "cardExpYear"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "cardExpYear" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "cardExpYear"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "cardExpYear" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "cardExpMonth"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "cardExpMonth" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "fullName"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "cardName" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "phoneNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "lastName" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "firstName" character varying`);
    }

}
