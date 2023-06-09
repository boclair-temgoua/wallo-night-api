import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1686322550947 implements MigrationInterface {
    name = 'Migration1686322550947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currency" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "code" character varying, "symbol" character varying, "amount" double precision, CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "slug" character varying, "color" character varying, "description" text, "userCreatedId" uuid, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying, "lastName" character varying, "phone" character varying, "firstAddress" character varying, "secondAddress" character varying, "birthday" TIMESTAMP, "currencyId" uuid, "countryId" uuid, "image" character varying, "color" character varying, "url" character varying, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contributor" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "type" "public"."contributor_type_enum" NOT NULL DEFAULT 'ORGANIZATION', "role" "public"."contributor_role_enum" NOT NULL DEFAULT 'ADMIN', "organizationId" uuid, "userCreatedId" uuid, CONSTRAINT "PK_816afef005b8100becacdeb6e58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "description" character varying, "slug" character varying, "userId" uuid, "organizationId" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "confirmedAt" TIMESTAMP, "email" character varying, "accessToken" text, "refreshToken" text, "username" character varying, "token" character varying, "password" character varying, "profileId" uuid, "organizationInUtilizationId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "discount" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "description" character varying, "percent" double precision NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "expiredAt" TIMESTAMP WITH TIME ZONE, "startedAt" TIMESTAMP WITH TIME ZONE, "organizationId" uuid, CONSTRAINT "PK_d05d8712e429673e459e7f1cddb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organization" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "phone" character varying, "email" character varying, "firstAddress" character varying, "secondAddress" character varying, "requiresPayment" boolean NOT NULL DEFAULT false, "color" character varying, "image" character varying, "userId" uuid, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_product" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "titleProduct" character varying, "currency" character varying, "discountProduct" double precision, "discountCoupon" double precision, "price" double precision, "priceDiscount" double precision, "discountPercent" double precision, "priceTotal" double precision, "quantity" bigint, "returnProduct" text, "userId" bigint, "userSellerId" uuid, "userClientId" uuid, "clientOrderId" uuid, "userTransportId" bigint, "statusConversation" integer NOT NULL DEFAULT '0', "status" "public"."order_product_status_enum" NOT NULL DEFAULT 'ORDERED', "productId" uuid, "organizationId" uuid, CONSTRAINT "PK_539ede39e518562dfdadfddb492" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "subTitle" character varying, "slug" character varying, "sku" character varying, "price" double precision, "description" text, "moreDescription" character varying, "inventory" bigint, "status" "public"."product_status_enum" NOT NULL DEFAULT 'ACTIVE', "imageUploadId" bigint, "categoryId" uuid, "discountId" uuid, "currencyId" uuid, "userCreatedId" uuid, "organizationId" uuid, CONSTRAINT "UQ_8cfaf4a1e80806d58e3dbe69224" UNIQUE ("slug"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."cart_status_enum" NOT NULL DEFAULT 'ADDED', "userId" uuid, "quantity" bigint, "productId" uuid, CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client_order" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderNumber" character varying NOT NULL, "subject" character varying, "paymentMethod" character varying, "currency" character varying, "email" character varying, "priceSupTotal" double precision, "priceTotalBeforeDiscount" double precision, "vat" character varying, "priceTotal" double precision, "price" double precision, "quantity" integer, "userClientId" uuid, CONSTRAINT "UQ_3c6045ecd3cfa13043f0695effe" UNIQUE ("orderNumber"), CONSTRAINT "PK_df9613f771136dc7059b147a601" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact_us" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isRed" boolean NOT NULL DEFAULT false, "ipLocation" character varying, "subject" character varying, "fullName" character varying, "phone" character varying, "countryId" integer, "email" character varying, "description" text, "userCreatedId" uuid, "organizationId" uuid, CONSTRAINT "PK_b61766a4d93470109266b976cfe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "country" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL DEFAULT false, "name" character varying, CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "faq" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying, "status" boolean NOT NULL DEFAULT true, "title" character varying, "type" character varying, "description" text, "userCreatedId" character varying, "userId" character varying, CONSTRAINT "PK_d6f5a52b1a96dd8d0591f9fbc47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "slug" character varying, "image" character varying, "isActive" boolean NOT NULL DEFAULT true, "description" character varying, "userId" uuid, "userCreatedId" uuid, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reset_password" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "accessToken" character varying, "token" character varying, CONSTRAINT "PK_82bffbeb85c5b426956d004a8f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "testimonial" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying, "fullName" character varying, "occupation" character varying, "rete" integer, "image" character varying, "link" character varying, "description" text, "userCreatedId" uuid, "userId" uuid, CONSTRAINT "PK_e1aee1c726db2d336480c69f7cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD CONSTRAINT "FK_4be92df1dfa5c24a494e3f6b330" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD CONSTRAINT "FK_7e29d8554a3e38fcc57a997dd47" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD CONSTRAINT "FK_195a0e2bd5101efc95c2be6c1ed" FOREIGN KEY ("userCreatedId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_5057f69022da9b19dd1dd96af6e" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_5334a80199f7cbe3e014c1768c7" FOREIGN KEY ("organizationInUtilizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount" ADD CONSTRAINT "FK_6fcb91339ad8937a414e7963641" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_b0d30285f6775593196167e2016" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_073c85ed133e05241040bd70f02" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_a0e1e5fe150ae1d4720b0044620" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_1e0bf1305eddcd6627b4a32a6c6" FOREIGN KEY ("discountId") REFERENCES "discount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_498f0ae3619a8e1f2f42434a4f7" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_32a4bdd261ec81f4ca6b3abe262" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_371eb56ecc4104c2644711fa85f" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_371eb56ecc4104c2644711fa85f"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_32a4bdd261ec81f4ca6b3abe262"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_498f0ae3619a8e1f2f42434a4f7"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_1e0bf1305eddcd6627b4a32a6c6"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_a0e1e5fe150ae1d4720b0044620"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_073c85ed133e05241040bd70f02"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_b0d30285f6775593196167e2016"`);
        await queryRunner.query(`ALTER TABLE "discount" DROP CONSTRAINT "FK_6fcb91339ad8937a414e7963641"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5334a80199f7cbe3e014c1768c7"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_5057f69022da9b19dd1dd96af6e"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`);
        await queryRunner.query(`ALTER TABLE "contributor" DROP CONSTRAINT "FK_195a0e2bd5101efc95c2be6c1ed"`);
        await queryRunner.query(`ALTER TABLE "contributor" DROP CONSTRAINT "FK_7e29d8554a3e38fcc57a997dd47"`);
        await queryRunner.query(`ALTER TABLE "contributor" DROP CONSTRAINT "FK_4be92df1dfa5c24a494e3f6b330"`);
        await queryRunner.query(`DROP TABLE "testimonial"`);
        await queryRunner.query(`DROP TABLE "reset_password"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "faq"`);
        await queryRunner.query(`DROP TABLE "country"`);
        await queryRunner.query(`DROP TABLE "contact_us"`);
        await queryRunner.query(`DROP TABLE "client_order"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "order_product"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "discount"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "contributor"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "currency"`);
    }

}
