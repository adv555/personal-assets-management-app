import { MigrationInterface, QueryRunner } from 'typeorm';

export class newMigration1663277696682 implements MigrationInterface {
  name = 'newMigration1663277696682';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wallet" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "sum" integer NOT NULL, "userWalletId" integer, CONSTRAINT "UQ_90a731b6fcd4463da9fbdf02a7e" UNIQUE ("name"), CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "lastName" character varying NOT NULL DEFAULT '', "firstName" character varying NOT NULL DEFAULT '', "refreshTokenHash" character varying NOT NULL DEFAULT '', "activationLink" character varying NOT NULL DEFAULT '', "is_verify" boolean NOT NULL DEFAULT false, "avatar_path" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_012bdcefef9c1c2bd51e06ee675" FOREIGN KEY ("userWalletId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_012bdcefef9c1c2bd51e06ee675"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "wallet"`);
  }
}
