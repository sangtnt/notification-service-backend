import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1747713199951 implements MigrationInterface {
  name = 'Migrations1747713199951';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "auth_service"."users"
            ADD "user_name" character varying(255) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "auth_service"."users"
            ADD CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" UNIQUE ("user_name")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_074a1f262efaca6aba16f7ed92" ON "auth_service"."users" ("user_name")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "auth_service"."IDX_074a1f262efaca6aba16f7ed92"
        `);
    await queryRunner.query(`
            ALTER TABLE "auth_service"."users" DROP CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920"
        `);
    await queryRunner.query(`
            ALTER TABLE "auth_service"."users" DROP COLUMN "user_name"
        `);
  }
}
