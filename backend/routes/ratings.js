import express from 'express';
import { appDataSource } from '../datasource.js';
import Rating from '../entities/rating.js';
import User from '../entities/user.js';
import Movie from '../entities/movie.js';

/**
 * @swagger
 * /api/ratings:
 *   get:
 *     summary: Récupérer tous les ratings
 *     responses:
 *       200:
 *         description: Liste des ratings
 * /api/ratings/movie/:movieId:
 *   get:
 *     summary: Récupérer les ratings d'un film
 *     responses:
 *       200:
 *         description: Ratings du film
 * /api/ratings:
 *   post:
 *     summary: Ajouter un rating
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
 *         description: Rating ajouté
 * /api/ratings/:movieId:
 *   put:
 *     summary: Modifier un rating
 *     responses:
 *       200:
 *         description: Rating modifié
 *   delete:
 *     summary: Supprimer un rating
 *     responses:
 *       204:
 *         description: Rating supprimé
 */

const router = express.Router();

// Récupérer tous les ratings
router.get('/', function (req, res) {
  appDataSource
    .getRepository(Rating)
    .find({
      relations: ['user', 'movie'],
    })
    .then(function (ratings) {
      res.json({ ratings: ratings });
    })
    .catch(function (error) {
      res.status(500).json({ message: 'Error fetching ratings' });
    });
});

// Récupérer les ratings d'un film spécifique
router.get('/movie/:movieId', function (req, res) {
  appDataSource
    .getRepository(Rating)
    .find({
      where: { movieId: req.params.movieId },
      relations: ['user'],
    })
    .then(function (ratings) {
      res.json({ ratings: ratings });
    })
    .catch(function (error) {
      res.status(500).json({ message: 'Error fetching ratings for movie' });
    });
});

// Ajouter un nouveau rating
router.post('/', function (req, res) {
  const { movieId, rating, comment } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!movieId || !rating) {
    return res
      .status(400)
      .json({ message: 'movieId and rating are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const ratingRepository = appDataSource.getRepository(Rating);
  const newRating = ratingRepository.create({
    userId,
    movieId,
    rating,
    comment: comment || null,
  });

  ratingRepository
    .insert(newRating)
    .then(function (result) {
      res.status(201).json(result);
    })
    .catch(function (error) {
      console.error(error);
      if (error.code === '23505') {
        res.status(400).json({
          message: 'You have already rated this movie',
        });
      } else {
        res.status(500).json({ message: 'Error while creating the rating' });
      }
    });
});

// Modifier un rating
router.put('/:movieId', function (req, res) {
  const userId = req.user?.id;
  const { movieId } = req.params;
  const { rating, comment } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!rating) {
    return res.status(400).json({ message: 'rating is required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  appDataSource
    .getRepository(Rating)
    .update(
      { userId, movieId },
      {
        rating,
        comment: comment || null,
        updatedAt: new Date(),
      }
    )
    .then(function (result) {
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Rating not found' });
      }
      res.status(200).json({ message: 'Rating updated successfully' });
    })
    .catch(function (error) {
      res.status(500).json({ message: 'Error while updating the rating' });
    });
});

// Supprimer un rating
router.delete('/:movieId', function (req, res) {
  const userId = req.user?.id;
  const { movieId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  appDataSource
    .getRepository(Rating)
    .delete({ userId, movieId })
    .then(function (result) {
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Rating not found' });
      }
      res.status(204).json({ message: 'Rating successfully deleted' });
    })
    .catch(function (error) {
      res.status(500).json({ message: 'Error while deleting the rating' });
    });
});

export default router;
