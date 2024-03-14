import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1710365143229 implements MigrationInterface {
    name = 'Migration1710365143229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" DROP CONSTRAINT "FK_4f4733482613920cd9f43a7e25e"`);
        await queryRunner.query(`ALTER TABLE "upload" DROP CONSTRAINT "UQ_4f4733482613920cd9f43a7e25e"`);
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "profileId"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "image" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "upload" ADD "profileId" uuid`);
        await queryRunner.query(`ALTER TABLE "upload" ADD CONSTRAINT "UQ_4f4733482613920cd9f43a7e25e" UNIQUE ("profileId")`);
        await queryRunner.query(`ALTER TABLE "upload" ADD CONSTRAINT "FK_4f4733482613920cd9f43a7e25e" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
