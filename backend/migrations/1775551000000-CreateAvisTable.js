export default class CreateRatingsTable1775551000000 {
  name = 'CreateRatingsTable1775551000000'

  async up(queryRunner) {
    await queryRunner.query(`DROP TABLE IF EXISTS "avis"`);
    await queryRunner.query(`
      CREATE TABLE "rating" (
        "userId" uuid NOT NULL,
        "movieId" uuid NOT NULL,
        "rating" integer NOT NULL CHECK ("rating" >= 1 AND "rating" <= 5),
        "comment" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_rating_userId_movieId" PRIMARY KEY ("userId", "movieId"),
        CONSTRAINT "FK_rating_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_rating_movieId" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE
      )
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "rating"`);
  }
}
