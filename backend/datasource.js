import { DataSource } from 'typeorm';
import Movie from '../entities/movie.js';
import User from '../entities/user.js';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  entities: [Movie, User],
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
