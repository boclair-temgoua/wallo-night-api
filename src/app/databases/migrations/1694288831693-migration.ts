import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694288831693 implements MigrationInterface {
    name = 'Migration1694288831693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" RENAME COLUMN "galleryShop" TO "enableGallery"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" RENAME COLUMN "enableGallery" TO "galleryShop"`);
    }

}
