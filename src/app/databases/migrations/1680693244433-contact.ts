import { MigrationInterface, QueryRunner } from "typeorm";

export class contact1680693244433 implements MigrationInterface {
    name = 'contact1680693244433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" RENAME COLUMN "subject" TO "color"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" RENAME COLUMN "color" TO "subject"`);
    }

}
