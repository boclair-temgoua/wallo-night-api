import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1682457874985 implements MigrationInterface {
    name = 'Migration1682457874985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "like" DROP COLUMN "likeableId"`);
        await queryRunner.query(`ALTER TABLE "like" ADD "likeableId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "like" DROP COLUMN "likeableId"`);
        await queryRunner.query(`ALTER TABLE "like" ADD "likeableId" bigint`);
    }

}
