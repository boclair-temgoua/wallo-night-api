import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1682457324339 implements MigrationInterface {
    name = 'Migration1682457324339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."like_type_enum" AS ENUM('GROUP', 'ORGANIZATION', 'PROJECT', 'SUBPROJECT', 'SUBSUBPROJECT', 'SUBSUBSUBPROJECT')`);
        await queryRunner.query(`CREATE TABLE "like" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" BIGSERIAL NOT NULL, "type" "public"."like_type_enum" NOT NULL DEFAULT 'ORGANIZATION', "likeableId" bigint, "userId" uuid, CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_e8fb739f08d47955a39850fac23" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_e8fb739f08d47955a39850fac23"`);
        await queryRunner.query(`DROP TABLE "like"`);
        await queryRunner.query(`DROP TYPE "public"."like_type_enum"`);
    }

}
