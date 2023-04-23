import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1682281444645 implements MigrationInterface {
    name = 'Migration1682281444645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" ADD "projectId" uuid`);
        await queryRunner.query(`ALTER TABLE "group" ADD "subProjectId" uuid`);
        await queryRunner.query(`ALTER TABLE "group" ADD "subSubProjectId" uuid`);
        await queryRunner.query(`ALTER TABLE "group" ADD "subSubSubProjectId" uuid`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_eab1ac7e29cfe9e26fc99f6926c" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_378b5aa11e9b7a548536c6caaeb" FOREIGN KEY ("subProjectId") REFERENCES "sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_72adf1ce7ad64686776fb1aa9ed" FOREIGN KEY ("subSubProjectId") REFERENCES "sub_sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_b75cf5127511461da2d9047b9ad" FOREIGN KEY ("subSubSubProjectId") REFERENCES "sub_sub_sub_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_b75cf5127511461da2d9047b9ad"`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_72adf1ce7ad64686776fb1aa9ed"`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_378b5aa11e9b7a548536c6caaeb"`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_eab1ac7e29cfe9e26fc99f6926c"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "subSubSubProjectId"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "subSubProjectId"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "subProjectId"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "projectId"`);
    }

}
