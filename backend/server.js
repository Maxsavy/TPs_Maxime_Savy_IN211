import 'dotenv/config';
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import usersRouter from './routes/users.js';
import moviesRouter from './routes/movies.js';
import authRouter from './routes/auth.js';
import ratingsRouter from './routes/ratings.js';
import { jsonErrorHandler } from './services/jsonErrorHandler.js';
import { appDataSource } from './datasource.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiRouter = express.Router();
const app = express();

app.use(logger('dev'));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? true : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(async (req, res, next) => {
  try {
    await ensureDb();
    next();
  } catch (err) {
    next(err);
  }
});

// Routes API
apiRouter.use('/users', usersRouter);
apiRouter.use("/movies", moviesRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/ratings", ratingsRouter);
app.use('/api', apiRouter);

// Fichiers statiques du frontend
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(jsonErrorHandler);

const port = parseInt(process.env.PORT || '8080');

let isInitialized = false;

export async function ensureDb() {
  if (isInitialized) return;
  await appDataSource
    .initialize()
    .then(() => {
      isInitialized = true;
      console.log('DB initialized');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization:', err);
    });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;