import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692127836675 implements MigrationInterface {
    name = 'Migration1692127836675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_category" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postId" uuid NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_388636ba602c312da6026dc9dbc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post_category" ADD CONSTRAINT "FK_494ef7ec4fdfe88460918524b51" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_category" ADD CONSTRAINT "FK_08d685cc924e645dfad494c9129" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_category" DROP CONSTRAINT "FK_08d685cc924e645dfad494c9129"`);
        await queryRunner.query(`ALTER TABLE "post_category" DROP CONSTRAINT "FK_494ef7ec4fdfe88460918524b51"`);
        await queryRunner.query(`DROP TABLE "post_category"`);
    }

}
