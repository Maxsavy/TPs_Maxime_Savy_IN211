import express from 'express';
import { appDataSource } from '../datasource.js';
import Avis from '../entities/avis.js';

/**
 * @swagger
 * /api/avis:
 *   get:
 *     summary: Récupérer tous les avis
 *     responses:
 *       200:
 *         description: Liste des avis
 *   post:
 *     summary: Ajouter un avis
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Avis ajouté
 * /api/avis/movie/:movieId:
 *   get:
 *     summary: Récupérer les avis d'un film
 *     responses:
 *       200:
 *         description: Avis du film
 * /api/avis/:movieId:
 *   put:
 *     summary: Modifier un avis
 *     responses:
 *       200:
 *         description: Avis modifié
 *   delete:
 *     summary: Supprimer un avis
 *     responses:
 *       204:
 *         description: Avis supprimé
 */

const router = express.Router();

router.get('/', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .find({})
    .then(function (movies) {
      res.json({ movies: movies });
    });
});

router.post('/new', function (req, res) {
  const movieRepository = appDataSource.getRepository(Movie);
  const newMovie = movieRepository.create({
    title: req.body.title,
    releaseDate: req.body.releaseDate,
  });

  movieRepository
    .insert(newMovie)
    .then(function (newDocument) {
      res.status(201).json(newDocument);
    })
    .catch(function (error) {
      console.error(error);
      if (error.code === '23505') {
        res.status(400).json({
          message: `Movie with title "${newMovie.title}" already exists`,
        });
      } else {
        res.status(500).json({ message: 'Error while creating the movie' });
      }
    });
});

router.delete('/:movieId', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .delete({ id: req.params.movieId })
    .then(function () {
      res.status(204).json({ message: 'Movie successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the user' });
    });
});

export default router;  