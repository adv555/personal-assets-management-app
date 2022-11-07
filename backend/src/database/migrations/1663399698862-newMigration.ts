import { MigrationInterface, QueryRunner } from 'typeorm';

export class newMigration1663399698862 implements MigrationInterface {
  name = 'newMigration1663399698862';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_012bdcefef9c1c2bd51e06ee675"`,
    );
    await queryRunner.query(
      `CREATE TABLE "income" ("id" SERIAL NOT NULL, "category_name" character varying(50) NOT NULL, "income_sum" numeric NOT NULL DEFAULT '0', "is_transaction" boolean NOT NULL DEFAULT false, "from_user_id" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "alternative_date" date, "wallet_id" integer, CONSTRAINT "PK_29a10f17b97568f70cee8586d58" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "UQ_90a731b6fcd4463da9fbdf02a7e"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "sum"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "userWalletId"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "wallet_name" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "status" character varying(50) NOT NULL DEFAULT 'open'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "total_balance" numeric NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "currency" character varying(50) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" ADD "owner_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "income" ADD CONSTRAINT "FK_a607de16c829e476070c3d5f4d5" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_26b096404e3b6ece7d44d88fb1a" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_26b096404e3b6ece7d44d88fb1a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "income" DROP CONSTRAINT "FK_a607de16c829e476070c3d5f4d5"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "currency"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "total_balance"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "wallet_name"`);
    await queryRunner.query(`ALTER TABLE "wallet" ADD "userWalletId" integer`);
    await queryRunner.query(`ALTER TABLE "wallet" ADD "sum" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "UQ_90a731b6fcd4463da9fbdf02a7e" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`DROP TABLE "income"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_012bdcefef9c1c2bd51e06ee675" FOREIGN KEY ("userWalletId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
