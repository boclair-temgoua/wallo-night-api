import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694687718607 implements MigrationInterface {
    name = 'Migration1694687718607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscribe" DROP CONSTRAINT "FK_6b23faf921da1c269bd7951f9ab"`);
        await queryRunner.query(`ALTER TABLE "subscribe" RENAME COLUMN "subscribableId" TO "subscriberId"`);
        await queryRunner.query(`ALTER TABLE "subscribe" ADD CONSTRAINT "FK_ce4d1992337c8dc5e9d7173a2cd" FOREIGN KEY ("subscriberId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscribe" DROP CONSTRAINT "FK_ce4d1992337c8dc5e9d7173a2cd"`);
        await queryRunner.query(`ALTER TABLE "subscribe" RENAME COLUMN "subscriberId" TO "subscribableId"`);
        await queryRunner.query(`ALTER TABLE "subscribe" ADD CONSTRAINT "FK_6b23faf921da1c269bd7951f9ab" FOREIGN KEY ("subscribableId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
