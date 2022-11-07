import { MigrationInterface, QueryRunner } from 'typeorm';

export class newMigration1663752726777 implements MigrationInterface {
  name = 'newMigration1663752726777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "income" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "costs" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "income" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "income" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "costs" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "costs" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "costs" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "costs" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "income" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "income" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "costs" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "income" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
