import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIncomeAndCostsCategories1665744636950
  implements MigrationInterface
{
  name = 'AddIncomeAndCostsCategories1665744636950';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying(150) NOT NULL DEFAULT 'My task to do', "is_done" boolean NOT NULL DEFAULT false, "listId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task_list" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(40) NOT NULL DEFAULT 'No Title', "userId" integer, CONSTRAINT "PK_e9f70d01f59395c1dfdc633ae37" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "income" DROP COLUMN "alternative_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "costs" DROP COLUMN "alternative_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "income" ADD "income_name" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."costs_category_name_enum" AS ENUM('groceries', 'bills', 'transport', 'presents', 'education', 'health', 'sport', 'family', 'travels', 'rent', 'credits', 'purchases', 'technique', 'clothes', 'services', 'car', 'entertainment', 'other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "costs" ADD "category_name" "public"."costs_category_name_enum" NOT NULL DEFAULT 'other'`,
    );
    await queryRunner.query(`ALTER TABLE "income" DROP COLUMN "category_name"`);
    await queryRunner.query(
      `CREATE TYPE "public"."income_category_name_enum" AS ENUM('salary', 'investments', 'deposits', 'presents', 'crypto', 'rent', 'sales', 'trades', 'other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "income" ADD "category_name" "public"."income_category_name_enum" NOT NULL DEFAULT 'other'`,
    );
    await queryRunner.query(`ALTER TABLE "income" DROP COLUMN "income_sum"`);
    await queryRunner.query(
      `ALTER TABLE "income" ADD "income_sum" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_9ee730a54c4a83c48b28067abf0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "activationLink" SET DEFAULT ''`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "total_balance"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "total_balance" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "costs" DROP COLUMN "cost_sum"`);
    await queryRunner.query(
      `ALTER TABLE "costs" ADD "cost_sum" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_d2275fe92da6a114d70796b7344" FOREIGN KEY ("listId") REFERENCES "task_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_list" ADD CONSTRAINT "FK_d34f2d64706c6a8188a6446678b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_list" DROP CONSTRAINT "FK_d34f2d64706c6a8188a6446678b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_d2275fe92da6a114d70796b7344"`,
    );
    await queryRunner.query(`ALTER TABLE "costs" DROP COLUMN "cost_sum"`);
    await queryRunner.query(
      `ALTER TABLE "costs" ADD "cost_sum" numeric NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "total_balance"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "total_balance" numeric NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "activationLink" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_9ee730a54c4a83c48b28067abf0" UNIQUE ("activationLink")`,
    );
    await queryRunner.query(`ALTER TABLE "income" DROP COLUMN "income_sum"`);
    await queryRunner.query(
      `ALTER TABLE "income" ADD "income_sum" numeric NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "income" DROP COLUMN "category_name"`);
    await queryRunner.query(`DROP TYPE "public"."income_category_name_enum"`);
    await queryRunner.query(
      `ALTER TABLE "income" ADD "category_name" character varying(50) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "costs" DROP COLUMN "category_name"`);
    await queryRunner.query(`DROP TYPE "public"."costs_category_name_enum"`);
    await queryRunner.query(`ALTER TABLE "income" DROP COLUMN "income_name"`);
    await queryRunner.query(`ALTER TABLE "costs" ADD "alternative_date" date`);
    await queryRunner.query(`ALTER TABLE "income" ADD "alternative_date" date`);
    await queryRunner.query(`DROP TABLE "task_list"`);
    await queryRunner.query(`DROP TABLE "task"`);
  }
}
