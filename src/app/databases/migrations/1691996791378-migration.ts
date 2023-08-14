import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1691996791378 implements MigrationInterface {
    name = 'Migration1691996791378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" RENAME COLUMN "userCreatedId" TO "userId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" RENAME COLUMN "userId" TO "userCreatedId"`);
    }

}
