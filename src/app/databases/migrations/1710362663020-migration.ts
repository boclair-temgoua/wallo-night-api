import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1710362663020 implements MigrationInterface {
  name = 'Migration1710362663020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "upload" ADD CONSTRAINT "UQ_4f4733482613920cd9f43a7e25e" UNIQUE ("profileId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" ADD CONSTRAINT "FK_4f4733482613920cd9f43a7e25e" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" ADD CONSTRAINT "FK_3d5d2d86703a0ce619445b57458" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" ADD CONSTRAINT "FK_f868ec4f79f79f72928942a683e" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" ADD CONSTRAINT "FK_ca00886c4e5467e6bd92f31dc68" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" ADD CONSTRAINT "FK_7bb9cd4da2ac5f3bbc4c59a69c4" FOREIGN KEY ("commissionId") REFERENCES "commission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" ADD CONSTRAINT "FK_4aace5a1a29c67fecf9faba4adb" FOREIGN KEY ("membershipId") REFERENCES "membership"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "upload" DROP CONSTRAINT "FK_4aace5a1a29c67fecf9faba4adb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" DROP CONSTRAINT "FK_7bb9cd4da2ac5f3bbc4c59a69c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" DROP CONSTRAINT "FK_ca00886c4e5467e6bd92f31dc68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" DROP CONSTRAINT "FK_f868ec4f79f79f72928942a683e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" DROP CONSTRAINT "FK_3d5d2d86703a0ce619445b57458"`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" DROP CONSTRAINT "FK_4f4733482613920cd9f43a7e25e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" DROP CONSTRAINT "UQ_4f4733482613920cd9f43a7e25e"`,
    );
  }
}
