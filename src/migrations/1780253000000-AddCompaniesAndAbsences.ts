import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCompaniesAndAbsences1780253000000 implements MigrationInterface {
  name = 'AddCompaniesAndAbsences1780253000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "companies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "address" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "UQ_3dacbb3eb4f095e29372ff8e131" UNIQUE ("name"), CONSTRAINT "REL_6dcdcbb7d72f64602307ec4ab3" UNIQUE ("ownerId"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "companyId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_sessions" ADD "companyId" uuid`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."absences_type_enum" AS ENUM('vacation', 'sick')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."absences_status_enum" AS ENUM('pending', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "absences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."absences_type_enum" NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "status" "public"."absences_status_enum" NOT NULL, "totalDays" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "companyId" uuid, CONSTRAINT "PK_bd79346866fea8ac6f269252748" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "companies" ADD CONSTRAINT "FK_6dcdcbb7d72f64602307ec4ab39" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_6f9395c9037632a31107c8a9e58" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_sessions" ADD CONSTRAINT "FK_561311907aa47c21420b51a9668" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "absences" ADD CONSTRAINT "FK_51dd37b347f1eb519b1e9a50202" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "absences" ADD CONSTRAINT "FK_01c5e703cc7b369917ede32d4ee" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "absences" DROP CONSTRAINT "FK_01c5e703cc7b369917ede32d4ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "absences" DROP CONSTRAINT "FK_51dd37b347f1eb519b1e9a50202"`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_sessions" DROP CONSTRAINT "FK_561311907aa47c21420b51a9668"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_6f9395c9037632a31107c8a9e58"`,
    );
    await queryRunner.query(
      `ALTER TABLE "companies" DROP CONSTRAINT "FK_6dcdcbb7d72f64602307ec4ab39"`,
    );
    await queryRunner.query(`DROP TABLE "absences"`);
    await queryRunner.query(`DROP TYPE "public"."absences_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."absences_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "work_sessions" DROP COLUMN "companyId"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "companyId"`);
    await queryRunner.query(`DROP TABLE "companies"`);
  }
}
