import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1747575716435 implements MigrationInterface {
    name = 'Migrations1747575716435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "auth_service"."users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying(255) NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "version" integer NOT NULL,
                "email" character varying(255),
                "phone_number" character varying(20),
                "is_email_verified" boolean NOT NULL DEFAULT false,
                "is_phone_number_verified" boolean NOT NULL DEFAULT false,
                "hashed_password" character varying(255),
                "first_name" character varying(100),
                "last_name" character varying(100),
                "is_active" boolean NOT NULL DEFAULT true,
                "last_login_at" TIMESTAMP WITH TIME ZONE,
                "current_hashed_refresh_token" character varying(512),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2" UNIQUE ("phone_number"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "auth_service"."users" ("email")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_17d1817f241f10a3dbafb169fd" ON "auth_service"."users" ("phone_number")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "auth_service"."IDX_17d1817f241f10a3dbafb169fd"
        `);
        await queryRunner.query(`
            DROP INDEX "auth_service"."IDX_97672ac88f789774dd47f7c8be"
        `);
        await queryRunner.query(`
            DROP TABLE "auth_service"."users"
        `);
    }

}
