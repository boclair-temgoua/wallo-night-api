import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694267430444 implements MigrationInterface {
    name = 'Migration1694267430444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" ADD "userId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "userId"`);
    }

}
