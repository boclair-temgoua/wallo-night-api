import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1699051666812 implements MigrationInterface {
    name = 'Migration1699051666812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" ADD "postId" uuid`);
        await queryRunner.query(`ALTER TABLE "upload" ADD "productId" uuid`);
        await queryRunner.query(`ALTER TABLE "upload" ADD "commissionId" uuid`);
        await queryRunner.query(`ALTER TABLE "upload" ADD "membershipId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "membershipId"`);
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "commissionId"`);
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "postId"`);
    }

}
