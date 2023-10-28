import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698501503698 implements MigrationInterface {
    name = 'Migration1698501503698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_a3422826753d4e6b079dea98342"`);
        await queryRunner.query(`ALTER TABLE "comment" RENAME COLUMN "organizationId" TO "userReceiveId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" RENAME COLUMN "userReceiveId" TO "organizationId"`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_a3422826753d4e6b079dea98342" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
