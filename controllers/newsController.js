// controllers/newsController.js
const NewsModel = require('../models/News');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

/**
 * Note:
 * - Use `NewsModel` for the Mongoose model to avoid shadowing.
 * - Export names match the router (getPublicNews, getNewsByCreatedFor, getNewsByType).
 */

exports.create = async (req, res) => {
  try {
    const {
      title,
      metaTitle,
      metaDescription,
      metaKeywords,
      content,
      source,
      categoryId,
      subcategoryId,
      type
    } = req.body;

    let imageUrl = req.body.imageUrl;
    if (req.file) imageUrl = `/uploads/${req.file.filename}`;

    const newsItem = new NewsModel({
      title,
      author: req.user ? req.user.username : 'system',
      imageUrl,
      metaTitle,
      metaDescription,
      metaKeywords,
      content,
      source,
      categoryId,
      subcategoryId,
      type
    });

    // console.log('Creating News with data:', newsItem);
    await newsItem.save();
    res.status(201).json(newsItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    let items;
    if (req.user && req.user.role === 'admin') {
      items = await NewsModel.find();
    } else if (req.user) {
      items = await NewsModel.find({
        $or: [
          { is_deleted: false, is_approved: true },
          { is_deleted: false, author: req.user.username }
        ]
      });
    } else {
      items = await NewsModel.find({ is_deleted: false, is_approved: true });
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUBLIC: all approved, non-deleted news
exports.getPublicNews = async (req, res) => {
  try {
    const items = await NewsModel.find({ is_deleted: false, is_approved: true });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await NewsModel.findById(req.params.id);
    if (!item || item.is_deleted) return res.status(404).json({ error: 'News not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {
      title,
      metaTitle,
      metaDescription,
      metaKeywords,
      content,
      categoryId,
      subcategoryId,
      type
    } = req.body;

    const updateData = {
      title,
      metaTitle,
      metaDescription,
      metaKeywords,
      content,
      categoryId,
      subcategoryId,
      type,
      updatedAt: new Date()
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      updateData.imageUrl = req.body.imageUrl;
    }

    const item = await NewsModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!item) return res.status(404).json({ error: 'News not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * softDelete:
 * - if admin and you want "hard delete" use hardDelete route instead.
 * - here admin will only mark is_deleted = true as well to avoid accidental hard deletes.
 */
exports.softDelete = async (req, res) => {
  try {
    const item = await NewsModel.findByIdAndUpdate(
      req.params.id,
      { is_deleted: true, updatedAt: new Date() },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'News not found' });
    res.json({ message: 'News soft deleted', item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.hardDelete = async (req, res) => {
  try {
    if (req.user && req.user.role === 'admin') {
      const item = await NewsModel.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ error: 'News not found' });
      res.json({ message: 'News hard deleted' });
    } else {
      res.status(403).json({ error: 'Only admin can hard delete news' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approve = async (req, res) => {
  try {
    const { is_approved } = req.body;
    if (typeof is_approved !== 'boolean') {
      return res.status(400).json({ error: 'is_approved (boolean) is required' });
    }
    const item = await NewsModel.findByIdAndUpdate(
      req.params.id,
      { is_approved, updatedAt: new Date() },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'News not found' });
    res.json({ message: `News ${is_approved ? 'approved' : 'disapproved'}`, item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUBLIC: get news by created_for (type) — matches router POST /public/by-created-for
exports.getNewsByCreatedFor = async (req, res) => {
  try {
    const { created_for } = req.body;
    if (!created_for) return res.status(400).json({ error: 'created_for is required' });

    const categories = await Category.find({ created_for, is_deleted: false, is_approved: true });
    const categoryIds = categories.map(cat => cat._id);

    const items = await NewsModel.find({
      is_deleted: false,
      is_approved: true,
      categoryId: { $in: categoryIds }
    })
      .populate({ path: 'categoryId', select: 'title' })
      .populate({ path: 'subcategoryId', select: 'title' });

    const itemsWithNames = items.map(i => ({
      ...i.toObject(),
      categoryName: i.categoryId ? i.categoryId.title : null,
      subcategoryName: i.subcategoryId ? i.subcategoryId.title : null
    }));

    res.json(itemsWithNames);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /type/:type — matches router.get('/type/:type', newsCtrl.getNewsByType)
exports.getNewsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const categories = await Category.find({
      created_for: type,
      is_deleted: false
    }).select('_id');

    if (!categories.length) return res.status(404).json({ error: 'No categories found' });

    const categoryIds = categories.map(c => c._id);

    const items = await NewsModel.find({
      categoryId: { $in: categoryIds },
      is_deleted: false,
      is_approved: true
    }).select('-subcategoryId -__v');

    res.json({ news: items });
  } catch (err) {
    console.error('Error fetching news by type:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
