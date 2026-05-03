import typeorm from 'typeorm';

const Movie = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id: {
      primary: true,
      type: String,      // l'id TMDB (ex: "550"), plus de generated
    },
    title: {
      type: String,
      nullable: true,
    },
    posterPath: {
      type: String,
      nullable: true,
    },
    releaseDate: {
      type: String,
      nullable: true,
    },
  },
});

export default Movie;