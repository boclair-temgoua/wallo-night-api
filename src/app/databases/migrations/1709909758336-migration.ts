import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1709909758336 implements MigrationInterface {
  name = 'Migration1709909758336';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_address" DROP CONSTRAINT "FK_1abd8badc4a127b0f357d9ecbc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" DROP CONSTRAINT "FK_640e370946e53d3117c038ef36a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" ADD CONSTRAINT "UQ_1abd8badc4a127b0f357d9ecbc2" UNIQUE ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" ADD CONSTRAINT "UQ_640e370946e53d3117c038ef36a" UNIQUE ("organizationId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" ADD CONSTRAINT "FK_1abd8badc4a127b0f357d9ecbc2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" ADD CONSTRAINT "FK_640e370946e53d3117c038ef36a" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_address" DROP CONSTRAINT "FK_640e370946e53d3117c038ef36a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" DROP CONSTRAINT "FK_1abd8badc4a127b0f357d9ecbc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" DROP CONSTRAINT "UQ_640e370946e53d3117c038ef36a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" DROP CONSTRAINT "UQ_1abd8badc4a127b0f357d9ecbc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" ADD CONSTRAINT "FK_640e370946e53d3117c038ef36a" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" ADD CONSTRAINT "FK_1abd8badc4a127b0f357d9ecbc2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
