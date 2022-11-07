import { MigrationInterface, QueryRunner } from 'typeorm';

export class newMigration1663401851188 implements MigrationInterface {
  name = 'newMigration1663401851188';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "costs" ("id" SERIAL NOT NULL, "cost_name" character varying(50) NOT NULL, "cost_sum" numeric NOT NULL DEFAULT '0', "is_transaction" boolean NOT NULL DEFAULT false, "to_user_id" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "alternative_date" date, "wallet_id" integer, CONSTRAINT "PK_05cc8aa05396a72553cdff6d5be" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "costs" ADD CONSTRAINT "FK_2f4b6f17fe7a1acf21ff50a06b2" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "costs" DROP CONSTRAINT "FK_2f4b6f17fe7a1acf21ff50a06b2"`,
    );
    await queryRunner.query(`DROP TABLE "costs"`);
  }
}
