import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1690583200817 implements MigrationInterface {
    name = 'Migration1690583200817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "fullName" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "fullName"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "lastName" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "firstName" character varying`);
    }

}
