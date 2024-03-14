import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1710347260416 implements MigrationInterface {
  name = 'Migration1710347260416';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" ADD "brand" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "brand"`);
  }
}
