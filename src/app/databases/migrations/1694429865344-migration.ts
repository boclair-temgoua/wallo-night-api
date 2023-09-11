import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694429865344 implements MigrationInterface {
    name = 'Migration1694429865344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "media" character varying`);
        await queryRunner.query(`ALTER TABLE "post" ADD "enableUrlMedia" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "enableUrlMedia"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "media"`);
    }

}
