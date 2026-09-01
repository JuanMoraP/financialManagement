import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1787200345380 implements MigrationInterface {
    name = 'InitialSchema1787200345380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refreshToken" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hashedToken" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP NOT NULL, "userIdId" uuid, CONSTRAINT "REL_0e26627e4941a4f3630506418c" UNIQUE ("userIdId"), CONSTRAINT "PK_be91607b0697b092c2bdff83b45" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "userId" uuid, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "age" integer NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "birthdate" TIMESTAMP NOT NULL, "country" character varying NOT NULL, "phone" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "isAdmin" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "financialProfile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "initialAmount" numeric(10,2) NOT NULL DEFAULT '0', "currentAmount" numeric(10,2) NOT NULL DEFAULT '0', "currentIncome" numeric(10,2) NOT NULL DEFAULT '0', "currentSpent" numeric(10,2) NOT NULL DEFAULT '0', "monthlySavingsGoal" numeric(10,2) NOT NULL DEFAULT '0', "currency" character varying NOT NULL DEFAULT 'usd', "preferredBank" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userIdId" uuid, CONSTRAINT "REL_38fabec01005658939d7407e09" UNIQUE ("userIdId"), CONSTRAINT "PK_847817a8e760b0cc9d6e22d053c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_transactiontype_enum" AS ENUM('incoming', 'outgoing')`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying NOT NULL, "transactionType" "public"."transaction_transactiontype_enum" NOT NULL, "amount" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "financialProfileIdId" uuid, "categoryIdId" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "refreshToken" ADD CONSTRAINT "FK_0e26627e4941a4f3630506418cc" FOREIGN KEY ("userIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_32b856438dffdc269fa84434d9f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "financialProfile" ADD CONSTRAINT "FK_38fabec01005658939d7407e097" FOREIGN KEY ("userIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_1042e6686b10ef27145eb5abfc8" FOREIGN KEY ("financialProfileIdId") REFERENCES "financialProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_a4d6a1418e2ef0e73e026d268e0" FOREIGN KEY ("categoryIdId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_a4d6a1418e2ef0e73e026d268e0"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_1042e6686b10ef27145eb5abfc8"`);
        await queryRunner.query(`ALTER TABLE "financialProfile" DROP CONSTRAINT "FK_38fabec01005658939d7407e097"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_32b856438dffdc269fa84434d9f"`);
        await queryRunner.query(`ALTER TABLE "refreshToken" DROP CONSTRAINT "FK_0e26627e4941a4f3630506418cc"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_transactiontype_enum"`);
        await queryRunner.query(`DROP TABLE "financialProfile"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "refreshToken"`);
    }

}
