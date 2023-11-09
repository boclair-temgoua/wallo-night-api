import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1699447321336 implements MigrationInterface {
    name = 'Migration1699447321336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" ADD "ipLocation" character varying`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "organizationId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "ipLocation"`);
    }

}
