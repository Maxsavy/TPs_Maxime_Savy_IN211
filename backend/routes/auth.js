import express from 'express';
import jwt from 'jsonwebtoken';
import { appDataSource } from '../datasource.js';
import User from '../entities/user.js';
import  {isValid}  from '../services/auth.js';
import { authMiddleware } from '../middlewares/auth.js';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authentifier un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentification réussie
 *       401:
 *         description: Identifiants invalides
 * /api/auth/me:
 *   get:
 *     summary: Récupérer les informations de l'utilisateur connecté
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *       401:
 *         description: Non authentifié
 */

const router = express.Router();

router.post('/login', async function (req, res) {
    const user = await appDataSource
    .getRepository(User)
    .findOne({ where: { email: req.body.email } });

    if (!user) {
    return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const valid = await isValid(req.body.password, user.password_hash);
    if (!valid) {
    return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });
    res.json({ token, user: { firstname: user.firstname, lastname: user.lastname, email: user.email } });
});



router.get('/me', authMiddleware, function (req, res) {
    res.json(req.user);
});

export default router;