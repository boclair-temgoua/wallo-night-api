import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1682458595371 implements MigrationInterface {
    name = 'Migration1682458595371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159"`);
        await queryRunner.query(`ALTER TABLE "like" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "like" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159"`);
        await queryRunner.query(`ALTER TABLE "like" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "like" ADD "id" BIGSERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159" PRIMARY KEY ("id")`);
    }

}
