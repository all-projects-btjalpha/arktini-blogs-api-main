const express = require('express');
const router = express.Router();
const categoryCtrl = require('../controllers/categoryController');
const upload = require('../middlewares/upload');
const { verifyAdmin } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               author:
 *                 type: string
 *               created_for:
 *                 type: string
 *                 enum: [EquipMedy, TeacherCool,Chef]
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Bad request
 */
router.post('/', verifyAdmin, upload.single('image'), categoryCtrl.create);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security: []
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/', categoryCtrl.getAll); // public

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category found
 *       404:
 *         description: Category not found
 */
router.get('/:id', categoryCtrl.getById); // public

/**
 * @swagger
 * /api/categories/with-subcategories/{id}:
 *   get:
 *     summary: Get category with subcategories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category with subcategories
 *       404:
 *         description: Category not found
 */
router.get('/with-subcategories/:id', categoryCtrl.getCategoryWithSubcategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               author:
 *                 type: string
 *               created_for:
 *                 type: string
 *                 enum: [EquipMedy, TeacherCool]
 *     responses:
 *       200:
 *         description: Category updated
 *       404:
 *         description: Category not found
 */
router.put('/:id', verifyAdmin, upload.single('image'), categoryCtrl.update);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 */
router.delete('/:id', verifyAdmin, categoryCtrl.delete);

module.exports = router;
