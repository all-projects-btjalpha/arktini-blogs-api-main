const Blog = require('../models/Blog');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');


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
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    const blog = new Blog({
      title,
      author: req.user.username,
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
 
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    let blogs;
    if (req.user && req.user.role === 'admin') {
      blogs = await Blog.find().populate('categoryId', 'title')
    } else if (req.user) {
      blogs = await Blog.find({
        $or: [
          { is_deleted: false, is_approved: true },
          { is_deleted: false, author: req.user.username }
        ]
      });
    } else {
      blogs = await Blog.find({ is_deleted: false, is_approved: true });
    }
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPublicBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ is_deleted: false, is_approved: true });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || blog.is_deleted) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
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
    let updateData = {
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
    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.softDelete = async (req, res) => {
  try {
    if (req.user && req.user.role === 'admin') {
      const blog = await Blog.findByIdAndDelete(req.params.id);
      if (!blog) return res.status(404).json({ error: 'Blog not found' });
      res.json({ message: 'Blog hard deleted' });
    } else {
      const blog = await Blog.findByIdAndUpdate(req.params.id, { is_deleted: true }, { new: true });
      if (!blog) return res.status(404).json({ error: 'Blog not found' });
      res.json({ message: 'Blog soft deleted' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.hardDelete = async (req, res) => {
  try {
    if (req.user && req.user.role === 'admin') {
      const blog = await Blog.findByIdAndDelete(req.params.id);
      if (!blog) return res.status(404).json({ error: 'Blog not found' });
      res.json({ message: 'Blog hard deleted' });
    } else {
      res.status(403).json({ error: 'Only admin can hard delete blogs' });
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
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { is_approved, updatedAt: new Date() },
      { new: true }
    );
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: `Blog ${is_approved ? 'approved' : 'disapproved'}`, blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogsByCreatedFor = async (req, res) => {
  try {
    const { created_for } = req.body;
    if (!created_for) return res.status(400).json({ error: 'created_for is required' });
    // Find all categories for this created_for
    const categories = await Category.find({ created_for, is_deleted: false, is_approved: true });
    const categoryIds = categories.map(cat => cat._id);
    // Find all blogs in these categories
    const blogs = await Blog.find({
      is_deleted: false,
      is_approved: true,
      categoryId: { $in: categoryIds }
    })
      .populate({ path: 'categoryId', select: 'title' })
      .populate({ path: 'subcategoryId', select: 'title' });
    // Format blogs to include category and subcategory names
    const blogsWithNames = blogs.map(blog => ({
      ...blog.toObject(),
      categoryName: blog.categoryId ? blog.categoryId.title : null,
      subcategoryName: blog.subcategoryId ? blog.subcategoryId.title : null
    }));
    res.json(blogsWithNames);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogsByType = async (req, res) => {
  try {
    const { type } = req.params;

    // 1. Get category IDs only (not needed in response)
    const categories = await Category.find({
      created_for: type,
      is_deleted: false
    }).select('_id');

    if (!categories.length) {
      return res.status(404).json({ error: 'No categories found' });
    }

    const categoryIds = categories.map(c => c._id);

    // 2. Fetch blogs: exclude subcategoryId and do NOT populate categoryId
    const blogs = await Blog.find({
      categoryId: { $in: categoryIds },
      is_deleted: false,
      is_approved:true
    })
      .select('-subcategoryId -__v'); 

    res.json({ blogs });

  } catch (err) {
    console.error('Error fetching blogs by type:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

