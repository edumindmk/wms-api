import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1777489816965 implements MigrationInterface {
    name = 'InitialSchema1777489816965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "work_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startAt" TIMESTAMP NOT NULL, "endAt" TIMESTAMP NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_2b15ef494243f1cc2bf0f731e76" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "work_sessions" ADD CONSTRAINT "FK_7f1bcfe98595e0a130117224ddf" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_sessions" DROP CONSTRAINT "FK_7f1bcfe98595e0a130117224ddf"`);
        await queryRunner.query(`DROP TABLE "work_sessions"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
