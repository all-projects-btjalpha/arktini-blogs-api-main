const express = require('express');
const router = express.Router();
const blogCtrl = require('../controllers/blogController');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management
 */

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a new blog
 *     tags: [Blogs]
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
 *              
 *               categoryId:
 *                 type: string
 *               subcategoryId:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Blog created
 *       400:
 *         description: Bad request
 */

router.post('/', verifyToken, upload.single('imageUrl'), blogCtrl.create);

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of blogs
 */
router.get('/', verifyToken, blogCtrl.getAll);

/**
 * @swagger
 * /api/blogs/public:
 *   get:
 *     summary: Get all approved and non-deleted blogs (public)
 *     tags: [Blogs]
 *     description: Fetches only blogs where is_approved is true and is_deleted is false. No authentication required.
 *     responses:
 *       200:
 *         description: List of public blogs
 */
router.get('/public', blogCtrl.getPublicBlogs);

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get blog by ID
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog found
 *       404:
 *         description: Blog not found
 */
router.get('/:id', verifyToken, blogCtrl.getById);


/**
 * @swagger
 * /api/blogs/details/{id}:
 *   get:
 *     summary: Get blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog found
 *       404:
 *         description: Blog not found
 */
router.get('/details/:id', blogCtrl.getById);

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update a blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID
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
 *                 description: Blog image file (optional, will replace old image if provided)
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
 *         description: Blog updated
 *       404:
 *         description: Blog not found
 */
router.put('/:id', verifyToken, upload.single('imageUrl'), blogCtrl.update);

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Soft delete a blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog soft deleted
 *       404:
 *         description: Blog not found
 */
router.delete('/:id', blogCtrl.softDelete);

/**
 * @swagger
 * /api/blogs/hard/{id}:
 *   delete:
 *     summary: Hard delete a blog (admin only)
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog hard deleted
 *       404:
 *         description: Blog not found
 */
router.delete('/hard/:id', verifyToken, verifyAdmin, blogCtrl.hardDelete);

/**
 * @swagger
 * /api/blogs/approve/{id}:
 *   put:
 *     summary: Approve or disapprove a blog (admin only)
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID to approve/disapprove
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
 *         description: Blog approval status updated
 *       400:
 *         description: is_approved (boolean) is required
 *       404:
 *         description: Blog not found
 *       403:
 *         description: Only admin can approve blogs
 */
router.put('/approve/:id', verifyToken, verifyAdmin, blogCtrl.approve);

// Public: Get blogs by created_for (type)
router.post('/public/by-created-for', blogCtrl.getBlogsByCreatedFor);

/**
 * @swagger
 * /api/blogs/type/{type}:
 *   get:
 *     summary: Get all categories and blogs by type/source
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [EquipMedy, TeacherCool,Chef]
 *         description: Blog source type
 *     responses:
 *       200:
 *         description: List of blogs and categories
 *       404:
 *         description: Not found
 */


router.get('/type/:type', blogCtrl.getBlogsByType); // Fixed quote position




module.exports = router;
