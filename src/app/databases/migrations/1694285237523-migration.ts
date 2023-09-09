import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1694285237523 implements MigrationInterface {
  name = 'Migration1694285237523';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "enableCommission" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "enableShop" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "enableGallery" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "enableGallery"`,
    );
    await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "enableShop"`);
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "enableCommission"`,
    );
  }
}
