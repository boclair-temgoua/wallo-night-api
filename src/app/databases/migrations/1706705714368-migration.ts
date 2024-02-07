import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1706705714368 implements MigrationInterface {
  name = 'Migration1706705714368';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comment" ADD "organizationId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_a3422826753d4e6b079dea98342" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_a3422826753d4e6b079dea98342"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP COLUMN "organizationId"`,
    );
  }
}
