import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1685792368628 implements MigrationInterface {
    name = 'Migration1685792368628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "description" character varying, "slug" character varying, "userId" uuid, "organizationId" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_product_status_enum" AS ENUM('ORDERED', 'DELIVERING')`);
        await queryRunner.query(`CREATE TABLE "order_product" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "titleProduct" character varying, "currency" character varying, "discountProduct" double precision, "discountCoupon" double precision, "price" double precision, "priceDiscount" double precision, "discountPercent" double precision, "priceTotal" double precision, "quantity" bigint, "returnProduct" text, "userId" bigint, "userSellerId" uuid, "userClientId" uuid, "clientOrderId" uuid, "userTransportId" bigint, "statusConversation" integer NOT NULL DEFAULT '0', "status" "public"."order_product_status_enum" NOT NULL DEFAULT 'ORDERED', "productId" uuid, "organizationId" uuid, CONSTRAINT "PK_539ede39e518562dfdadfddb492" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client_order" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderNumber" character varying NOT NULL, "subject" character varying, "paymentMethod" character varying, "currency" character varying, "email" character varying, "priceSupTotal" double precision, "priceTotalBeforeDiscount" double precision, "vat" character varying, "priceTotal" double precision, "price" double precision, "quantity" integer, "userClientId" uuid, CONSTRAINT "UQ_3c6045ecd3cfa13043f0695effe" UNIQUE ("orderNumber"), CONSTRAINT "PK_df9613f771136dc7059b147a601" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_5057f69022da9b19dd1dd96af6e" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_073c85ed133e05241040bd70f02" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_a0e1e5fe150ae1d4720b0044620" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_a0e1e5fe150ae1d4720b0044620"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_073c85ed133e05241040bd70f02"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_5057f69022da9b19dd1dd96af6e"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`);
        await queryRunner.query(`DROP TABLE "client_order"`);
        await queryRunner.query(`DROP TABLE "order_product"`);
        await queryRunner.query(`DROP TYPE "public"."order_product_status_enum"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
    }

}
