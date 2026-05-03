import express from 'express';
import { appDataSource } from '../datasource.js';
import { hashedPassword } from '../services/auth.js';
import User from '../entities/user.js';

const router = express.Router();

router.get('/', function (req, res) {
  console.log("getting users");
  appDataSource
    .getRepository(User)
    .find({})
    .then(function (users) {
      res.json({ users: users });
    });
});

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
