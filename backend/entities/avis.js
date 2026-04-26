import typeorm from 'typeorm';

const Rating = new typeorm.EntitySchema({
  name: 'Rating',
  columns: {
    userId: {
      primary: true,
      type: 'uuid',
    },
    movieId: {
      primary: true,
      type: 'uuid',
    },
    rating: {
      type: 'integer',
    },
    comment: {
      type: 'text',
      nullable: true,
    },
    createdAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updatedAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'userId' },
    },
    movie: {
      type: 'many-to-one',
      target: 'Movie',
      joinColumn: { name: 'movieId' },
    },
  },
});

export default Rating;
