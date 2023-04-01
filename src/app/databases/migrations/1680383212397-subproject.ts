import { MigrationInterface, QueryRunner } from "typeorm";

export class subproject1680383212397 implements MigrationInterface {
    name = 'subproject1680383212397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contributor" ADD "subProjectId" uuid`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD CONSTRAINT "FK_6730d6b949c10806c81eb0fb4ca" FOREIGN KEY ("subProjectId") REFERENCES "sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contributor" DROP CONSTRAINT "FK_6730d6b949c10806c81eb0fb4ca"`);
        await queryRunner.query(`ALTER TABLE "contributor" DROP COLUMN "subProjectId"`);
    }

}
