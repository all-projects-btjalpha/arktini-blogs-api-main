const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const { verifyAdmin } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               requestFor:
 *                 type: string
 *                 enum: ["EquipMedy", "Teachercool"]
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', authCtrl.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required: [emailorUsername, password]
 *                 properties:
 *                   emailorUsername:
 *                     type: string
 *                   password:
 *                     type: string
 *               - type: object
 *                 required: [emailorUsername, password]
 *                 properties:
 *                   emailorUsername:
 *                     type: string
 *                   password:
 *                     type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post('/login', authCtrl.login);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 */
router.get('/users', verifyAdmin, authCtrl.getUsers);

/**
 * @swagger
 * /api/auth/user/{id}/status:
 *   put:
 *     summary: Update user status (admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: User status updated
 *       403:
 *         description: Forbidden
 */
router.put('/user/:id/status', verifyAdmin, authCtrl.updateUserStatus);

module.exports = router;
