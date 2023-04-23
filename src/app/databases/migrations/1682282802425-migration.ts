import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1682282802425 implements MigrationInterface {
    name = 'Migration1682282802425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_7bec24423f57c3786409cc3cc8d"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "userId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_7bec24423f57c3786409cc3cc8d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
