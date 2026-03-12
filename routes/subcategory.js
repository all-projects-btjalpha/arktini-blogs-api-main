const express = require('express');
const router = express.Router();
const subcategoryCtrl = require('../controllers/subcategoryController');
const upload = require('../middlewares/upload');
const { verifyAdmin } = require('../middlewares/auth');

/**
 * @swagger
 * /api/subcategories:
 *   post:
 *     summary: Create a new subcategory
 *     tags: [Subcategories]
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
 *               category:
 *                 type: string
 *                 description: Category ID
 *     responses:
 *       201:
 *         description: Subcategory created
 *       400:
 *         description: Bad request
 *     security:
 *       - bearerAuth: []
 */
router.post('/', verifyAdmin, upload.single('image'), subcategoryCtrl.create);

/**
 * @swagger
 * /api/subcategories:
 *   get:
 *     summary: Get all subcategories
 *     tags: [Subcategories]
 *     security: []
 *     responses:
 *       200:
 *         description: List of subcategories
 */
router.get('/', subcategoryCtrl.getAll);

/**
 * @swagger
 * /api/subcategories/{id}:
 *   get:
 *     summary: Get subcategory by ID
 *     tags: [Subcategories]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Subcategory ID
 *     responses:
 *       200:
 *         description: Subcategory found
 *       404:
 *         description: Subcategory not found
 */
router.get('/:id', subcategoryCtrl.getById);

/**
 * @swagger
 * /api/subcategories/category/{categoryId}:
 *   get:
 *     summary: Get subcategories by category ID
 *     tags: [Subcategories]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: List of subcategories for the category
 */
router.get('/category/:categoryId', subcategoryCtrl.getByCategory);

/**
 * @swagger
 * /api/subcategories/{id}:
 *   put:
 *     summary: Update a subcategory
 *     tags: [Subcategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Subcategory ID
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
 *               category:
 *                 type: string
 *                 description: Category ID
 *     responses:
 *       200:
 *         description: Subcategory updated
 *       404:
 *         description: Subcategory not found
 */
router.put('/:id', verifyAdmin, upload.single('image'), subcategoryCtrl.update);

/**
 * @swagger
 * /api/subcategories/{id}:
 *   delete:
 *     summary: Delete a subcategory
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Subcategory ID
 *     responses:
 *       200:
 *         description: Subcategory deleted
 *       404:
 *         description: Subcategory not found
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', verifyAdmin, subcategoryCtrl.delete);

module.exports = router;
