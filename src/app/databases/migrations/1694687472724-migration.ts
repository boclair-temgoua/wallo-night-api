import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694687472724 implements MigrationInterface {
    name = 'Migration1694687472724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subscribe" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "expiredAt" TIMESTAMP WITH TIME ZONE, "subscribableId" uuid, "membershipId" uuid, "userId" uuid, CONSTRAINT "PK_3e91e772184cd3feb30688ef1b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subscribe" ADD CONSTRAINT "FK_6b23faf921da1c269bd7951f9ab" FOREIGN KEY ("subscribableId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscribe" ADD CONSTRAINT "FK_b329814fde1b6d5e47b4d3ebf69" FOREIGN KEY ("membershipId") REFERENCES "membership"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscribe" ADD CONSTRAINT "FK_78138550e21d8b67790d761148d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscribe" DROP CONSTRAINT "FK_78138550e21d8b67790d761148d"`);
        await queryRunner.query(`ALTER TABLE "subscribe" DROP CONSTRAINT "FK_b329814fde1b6d5e47b4d3ebf69"`);
        await queryRunner.query(`ALTER TABLE "subscribe" DROP CONSTRAINT "FK_6b23faf921da1c269bd7951f9ab"`);
        await queryRunner.query(`DROP TABLE "subscribe"`);
    }

}
