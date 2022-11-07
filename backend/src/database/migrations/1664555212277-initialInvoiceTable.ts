import { MigrationInterface, QueryRunner } from 'typeorm';

export class initialInvoiceTable1664555212277 implements MigrationInterface {
  name = 'initialInvoiceTable1664555212277';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "invoice_item" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(300) NOT NULL, "amount" integer NOT NULL DEFAULT '0', "price" integer NOT NULL DEFAULT '0', "subTotal" integer NOT NULL DEFAULT '0', "invoiceId" integer, CONSTRAINT "PK_621317346abdf61295516f3cb76" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoices" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "paid" boolean NOT NULL DEFAULT false, "discount" integer NOT NULL DEFAULT '0', "dueDate" TIMESTAMP WITH TIME ZONE NOT NULL, "invoiceDate" TIMESTAMP WITH TIME ZONE, "invoiceDetails" character varying(500), "total" integer NOT NULL DEFAULT '0', "createdById" integer, "billedToId" integer, CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_invoices" ("invoice" integer NOT NULL, "user" integer NOT NULL, CONSTRAINT "PK_c641b743f8275343dd0581e53a1" PRIMARY KEY ("invoice", "user"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_29844032db8ad189c30ef51e27" ON "user_invoices" ("invoice") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d4631ed7c078efc0f1c6330adf" ON "user_invoices" ("user") `,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_verify"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar_path"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "address" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "phone" character varying`);
    await queryRunner.query(`ALTER TABLE "user" ADD "birthdate" date`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isVerified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "avatarPath" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "firstName" character varying(64) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "lastName" character varying(64) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" character varying(320) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "refreshTokenHash" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "refreshTokenHash" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_9ee730a54c4a83c48b28067abf0" UNIQUE ("activationLink")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "activationLink" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "status" "public"."wallet_status_enum" NOT NULL DEFAULT 'open'`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "currency"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "currency" "public"."wallet_currency_enum" NOT NULL DEFAULT 'UAH'`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_item" ADD CONSTRAINT "FK_553d5aac210d22fdca5c8d48ead" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD CONSTRAINT "FK_dc9c84f58ab53b5c844c276e435" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD CONSTRAINT "FK_fe6fc9ac453fb0cf3668ab5da50" FOREIGN KEY ("billedToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "income" ADD CONSTRAINT "FK_cce098e434b6cd4a5b714118353" FOREIGN KEY ("from_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "costs" ADD CONSTRAINT "FK_829c62c6ded28233438a9ccdd12" FOREIGN KEY ("to_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invoices" ADD CONSTRAINT "FK_29844032db8ad189c30ef51e27a" FOREIGN KEY ("invoice") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invoices" ADD CONSTRAINT "FK_d4631ed7c078efc0f1c6330adf2" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_invoices" DROP CONSTRAINT "FK_d4631ed7c078efc0f1c6330adf2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invoices" DROP CONSTRAINT "FK_29844032db8ad189c30ef51e27a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "costs" DROP CONSTRAINT "FK_829c62c6ded28233438a9ccdd12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "income" DROP CONSTRAINT "FK_cce098e434b6cd4a5b714118353"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP CONSTRAINT "FK_fe6fc9ac453fb0cf3668ab5da50"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP CONSTRAINT "FK_dc9c84f58ab53b5c844c276e435"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_item" DROP CONSTRAINT "FK_553d5aac210d22fdca5c8d48ead"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "currency"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "currency" character varying(50) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "status" character varying(50) NOT NULL DEFAULT 'open'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "activationLink" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_9ee730a54c4a83c48b28067abf0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "refreshTokenHash" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "refreshTokenHash" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "lastName" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "firstName" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarPath"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isVerified"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birthdate"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "avatar_path" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "is_verify" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d4631ed7c078efc0f1c6330adf"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_29844032db8ad189c30ef51e27"`,
    );
    await queryRunner.query(`DROP TABLE "user_invoices"`);
    await queryRunner.query(`DROP TABLE "invoices"`);
    await queryRunner.query(`DROP TABLE "invoice_item"`);
  }
}
