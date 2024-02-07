import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1707224942062 implements MigrationInterface {
  name = 'Migration1707224942062';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "priceTotalNotDiscount" bigint, "priceTotalDiscount" bigint, "currency" character varying, "userId" uuid, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_item_model_enum" AS ENUM('ORGANIZATION', 'CAMPAIGN', 'DONATION', 'MEMBERSHIP', 'COMMISSION', 'PRODUCT', 'HELP', 'POST', 'GALLERY', 'COMMENT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_item" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" bigint, "percentDiscount" bigint, "price" bigint, "priceDiscount" bigint, "organizationBeyerId" uuid, "organizationSellerId" uuid, "model" "public"."order_item_model_enum" NOT NULL DEFAULT 'PRODUCT', "currency" character varying, "commissionId" uuid, "productId" uuid, "orderId" uuid, "userId" uuid, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD "currency" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "cart" ADD "commissionId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_ed65b2f923d5ea760c3e9b1739b" FOREIGN KEY ("commissionId") REFERENCES "commission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_5d2bf74baf27e1386676d1ff594" FOREIGN KEY ("commissionId") REFERENCES "commission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_845716d96530a440c6cdc6c7346" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_845716d96530a440c6cdc6c7346"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_904370c093ceea4369659a3c810"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_5d2bf74baf27e1386676d1ff594"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_ed65b2f923d5ea760c3e9b1739b"`,
    );
    await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "commissionId"`);
    await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "currency"`);
    await queryRunner.query(`DROP TABLE "order_item"`);
    await queryRunner.query(`DROP TYPE "public"."order_item_model_enum"`);
    await queryRunner.query(`DROP TABLE "order"`);
  }
}
