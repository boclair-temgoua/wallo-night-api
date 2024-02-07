import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1707266569542 implements MigrationInterface {
  name = 'Migration1707266569542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_item_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'OR_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD "status" "public"."order_item_status_enum" NOT NULL DEFAULT 'PENDING'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."order_item_status_enum"`);
  }
}
