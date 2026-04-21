import 'dotenv/config';
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import usersRouter from './routes/users.js';
import moviesRouter from './routes/movies.js';
import authRouter from './routes/auth.js';
import { routeNotFoundJsonHandler } from './services/routeNotFoundJsonHandler.js';
import { jsonErrorHandler } from './services/jsonErrorHandler.js';
import { appDataSource } from './datasource.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';
import cookieParser from 'cookie-parser';

const apiRouter = express.Router();

console.log('Data Source has been initialized!');
const app = express();

app.use(logger('dev'));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec));
app.use(async (req, res, next) => {
  try {
    await ensureDb();
    next();
  } catch (err) {
    next(err);
  }
});

// Register routes
apiRouter.get('/', (req, res) => {
  res.send('Hello from Express!');
});
apiRouter.use('/users', usersRouter);
apiRouter.use("/movies", moviesRouter);
apiRouter.use("/auth", authRouter);

// Register API router
app.use('/', apiRouter);

// Register 404 middleware and error handler
app.use(routeNotFoundJsonHandler); // this middleware must be registered after all routes to handle 404 correctly
app.use(jsonErrorHandler); // this error handler must be registered after all middleware to catch all errors

const port = parseInt(process.env.PORT || '8080');

let isInitialized = false;

export async function ensureDb() {
  if (isInitialized) {
    return;
  }

  await appDataSource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
      isInitialized = true;
      console.log('DB initialized');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization:', err);
    });
}

export default app;
