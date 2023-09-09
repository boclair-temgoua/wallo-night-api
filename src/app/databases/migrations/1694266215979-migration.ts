import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694266215979 implements MigrationInterface {
    name = 'Migration1694266215979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" ADD "postId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "postId"`);
    }

}
