import express from 'express';
import { appDataSource } from '../datasource.js';
import { hashedPassword } from '../services/auth.js';
import User from '../entities/user.js';

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer la liste des utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 * /api/users/new:
 *   post:
 *     summary: Ajouter un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               password_hash:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur ajouté
 *       400:
 *         description: Utilisateur déjà existant
 *       500:
 *         description: Erreur serveur
  * /api/users/:userId:
 *   delete:
 *     summary: Supprimer un utilisateur à partir de son ID
 *     responses:
 *       204:
 *         description: Utilisateur supprimé
 *       500:
 *         description: Erreur serveur
 */

const router = express.Router();

// Récupérer tous les users
router.get('/', function (req, res) {
  console.log("getting users");
  appDataSource
    .getRepository(User)
    .find({})
    .then(function (users) {
      res.json({ users: users });
    });
});

// Récupérer un user par son id
router.post('/new', async function (req, res) {
  const userRepository = appDataSource.getRepository(User);

  const password_hash = await hashedPassword(req.body.password_hash);

  const newUser = userRepository.create({
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password_hash,
  });

  try {
    const newDocument = await userRepository.insert(newUser);
    res.status(201).json(newDocument);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      res.status(400).json({
        message: `User with email "${newUser.email}" already exists`,
      });
    } else {
      res.status(500).json({ message: 'Error while creating the user' });
    }
  }
});

// Supprimer un user par son id
router.delete('/:userId', function (req, res) {
  appDataSource
    .getRepository(User)
    .delete({ id: req.params.userId })
    .then(function () {
      res.status(204).json({ message: 'User successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the user' });
    });
});

export default router;
