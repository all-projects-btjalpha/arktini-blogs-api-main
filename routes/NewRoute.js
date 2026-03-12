const express = require('express');
const router = express.Router();
const newsCtrl = require('../controllers/newsController');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

/**
 * @swagger
 * tags:
 *   name: News
 *   description: News management
 */

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Create a new news
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *               metaTitle:
 *                 type: string
 *               metaDescription:
 *                 type: string
 *               metaKeywords:
 *                 type: string
 *               content:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               subcategoryId:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: News created
 *       400:
 *         description: Bad request
 */

router.post('/', verifyToken, upload.single('imageUrl'), newsCtrl.create);

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Get all news
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of news
 */
router.get('/', verifyToken, newsCtrl.getAll);

/**
 * @swagger
 * /api/news/public:
 *   get:
 *     summary: Get all approved and non-deleted news (public)
 *     tags: [News]
 *     description: Fetches only news where is_approved is true and is_deleted is false. No authentication required.
 *     responses:
 *       200:
 *         description: List of public news
 */
router.get('/public', newsCtrl.getPublicNews);

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Get news by ID
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: News ID
 *     responses:
 *       200:
 *         description: News found
 *       404:
 *         description: News not found
 */
router.get('/:id', verifyToken, newsCtrl.getById);


/**
 * @swagger
 * /api/news/details/{id}:
 *   get:
 *     summary: Get news by ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: News ID
 *     responses:
 *       200:
 *         description: News found
 *       404:
 *         description: News not found
 */
router.get('/details/:id', newsCtrl.getById);

/**
 * @swagger
 * /api/news/{id}:
 *   put:
 *     summary: Update a news
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: News ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *                 description: News image file (optional, will replace old image if provided)
 *               metaTitle:
 *                 type: string
 *               metaDescription:
 *                 type: string
 *               metaKeywords:
 *                 type: string
 *               content:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               subcategoryId:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: News updated
 *       404:
 *         description: News not found
 */
router.put('/:id', verifyToken, upload.single('imageUrl'), newsCtrl.update);

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Soft delete a news
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: News ID
 *     responses:
 *       200:
 *         description: News soft deleted
 *       404:
 *         description: News not found
 */
router.delete('/:id', newsCtrl.softDelete);

/**
 * @swagger
 * /api/news/hard/{id}:
 *   delete:
 *     summary: Hard delete a news (admin only)
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: News ID
 *     responses:
 *       200:
 *         description: News hard deleted
 *       404:
 *         description: News not found
 */
router.delete('/hard/:id', verifyToken, verifyAdmin, newsCtrl.hardDelete);

/**
 * @swagger
 * /api/news/approve/{id}:
 *   put:
 *     summary: Approve or disapprove a news (admin only)
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: News ID to approve/disapprove
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_approved:
 *                 type: boolean
 *                 description: true to approve, false to disapprove
 *     responses:
 *       200:
 *         description: News approval status updated
 *       400:
 *         description: is_approved (boolean) is required
 *       404:
 *         description: News not found
 *       403:
 *         description: Only admin can approve news
 */
router.put('/approve/:id', verifyToken, verifyAdmin, newsCtrl.approve);

// Public: Get news by created_for (type)
router.post('/public/by-created-for', newsCtrl.getNewsByCreatedFor);

/**
 * @swagger
 * /api/news/type/{type}:
 *   get:
 *     summary: Get all categories and news by type/source
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [EquipMedy, TeacherCool]
 *         description: News source type
 *     responses:
 *       200:
 *         description: List of news and categories
 *       404:
 *         description: Not found
 */
router.get('/type/:type', newsCtrl.getNewsByType);

module.exports = router;
