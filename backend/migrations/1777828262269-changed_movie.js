/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class ChangedMovie1777828262269 {
    name = 'ChangedMovie1777828262269'

    /**
     * @param {QueryRunner} queryRunner
     */
        async up(queryRunner) {
        await queryRunner.query(`DELETE FROM "rating"`);
        await queryRunner.query(`DELETE FROM "movie"`);
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "FK_rating_userId"`);
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "FK_rating_movieId"`);
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "rating_rating_check"`);
        
        // Movie : passer id de uuid → varchar
        await queryRunner.query(`ALTER TABLE "movie" ADD "posterPath" character varying`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "movie" ALTER COLUMN "title" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "UQ_a81090ad0ceb645f30f9399c347"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "releaseDate"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "releaseDate" character varying`);

        // Rating : passer movieId de uuid → varchar (userId reste uuid !)
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "PK_rating_userId_movieId"`);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "PK_rating_userId_movieId" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "rating" DROP COLUMN "movieId"`);
        await queryRunner.query(`ALTER TABLE "rating" ADD "movieId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "PK_rating_userId_movieId"`);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "PK_90a30e8f5cba6a5252e7931001b" PRIMARY KEY ("userId", "movieId")`);

        await queryRunner.query(`ALTER TABLE "rating" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "rating" ALTER COLUMN "updatedAt" SET DEFAULT now()`);

        // FK : userId → uuid, movieId → varchar, les deux sont maintenant compatibles
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "FK_rating_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "FK_rating_movieId" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "rating" DROP CONSTRAINT "FK_1a3badf27affbca3a224f01f7de"
        `);
        await queryRunner.query(`
            ALTER TABLE "rating" DROP CONSTRAINT "FK_a6c53dfc89ba3188b389ef29a62"
        `);
        await queryRunner.query(`
            ALTER TABLE "rating"
            ALTER COLUMN "updatedAt"
            SET DEFAULT CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "rating"
            ALTER COLUMN "createdAt"
            SET DEFAULT CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "rating" DROP CONSTRAINT "PK_90a30e8f5cba6a5252e7931001b"
        `);
        await queryRunner.query(`
            ALTER TABLE "rating"
            ADD CONSTRAINT "PK_a6c53dfc89ba3188b389ef29a62" PRIMARY KEY ("userId")
        `);
        await queryRunner.query(`
            ALTER TABLE "rating" DROP COLUMN "movieId"
        `);
        await queryRunner.query(`
            ALTER TABLE "rating"
            ADD "movieId" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "rating" DROP CONSTRAINT "PK_a6c53dfc89ba3188b389ef29a62"
        `);
        await queryRunner.query(`
            ALTER TABLE "rating"
            ADD CONSTRAINT "PK_rating_userId_movieId" PRIMARY KEY ("movieId", "userId")
        `);
        await queryRunner.query(`
            ALTER TABLE "rating" DROP CONSTRAINT "PK_rating_userId_movieId"
        `);
        await queryRunner.query(`
            ALTER TABLE "rating"
            ADD CONSTRAINT "PK_rating_userId_movieId" PRIMARY KEY ("movieId")
        `);
        await queryRunner.query(`
            ALTER TABLE "rating" DROP COLUMN "userId"
        `);
        await queryRunner.query(`
            ALTER TABLE "rating"
            ADD "userId" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "rating" DROP CONSTRAINT "PK_rating_userId_movieId"
        `);
        await queryRunner.query(`
            ALTER TABLE "rating"
            ADD CONSTRAINT "PK_rating_userId_movieId" PRIMARY KEY ("userId", "movieId")
        `);
        await queryRunner.query(`
            ALTER TABLE "movie" DROP COLUMN "releaseDate"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
            ADD "releaseDate" TIMESTAMP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
            ADD CONSTRAINT "UQ_a81090ad0ceb645f30f9399c347" UNIQUE ("title")
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
            ALTER COLUMN "title"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "movie" DROP CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
            ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
            ADD CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "movie" DROP COLUMN "posterPath"
        `);
        await queryRunner.query(`
            ALTER TABLE "rating"
            ADD CONSTRAINT "rating_rating_check" CHECK (
                    (
                        (rating >= 1)
                        AND (rating <= 5)
                    )
                )
        `);
        await queryRunner.query(`
            ALTER TABLE "rating"
            ADD CONSTRAINT "FK_rating_movieId" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "rating"
            ADD CONSTRAINT "FK_rating_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }
}
