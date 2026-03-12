const categoryService = require('../services/categoryService');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const fs = require('fs');
const path = require('path');

exports.create = async (req, res) => {
  try {
    let data = req.body;
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }
    const category = await categoryService.createCategory(data);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    let categories;
    if (req.user && req.user.role === 'admin') {
      categories = await categoryService.getCategories();
    } else if (req.user) {
      // Show all approved, and also non-approved created by this user
      categories = await categoryService.getCategories({
        $or: [
          { is_deleted: false, is_approved: true },
          { is_deleted: false, author: req.user.username }
        ]
      });
    } else {
      categories = await categoryService.getCategories({ is_deleted: false, is_approved: true });
    }
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategoryWithSubcategories = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    const subcategories = await Subcategory.find({ category: req.params.id });
    res.json({ category, subcategories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let data = req.body;
    let oldImage = null;
    if (req.file) {
      // Find the existing category to get the old image path
      const existing = await categoryService.getCategoryById(req.params.id);
      if (existing && existing.image) {
        oldImage = path.join(__dirname, '..', existing.image);
      }
      data.image = `/uploads/${req.file.filename}`;
    }
    const category = await categoryService.updateCategory(req.params.id, data);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    // Delete old image if new one was uploaded
    if (oldImage) {
      fs.unlink(oldImage, err => { /* ignore error if file doesn't exist */ });
    }
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    if (req.user && req.user.role.toLowerCase() === 'admin') {
      // Hard delete category
      const category = await categoryService.deleteCategory(req.params.id);
      if (!category) return res.status(404).json({ error: 'Category not found' });
      // Delete all subcategories and blogs related to this category
      const Subcategory = require('../models/Subcategory');
      const Blog = require('../models/Blog');
      await Subcategory.deleteMany({ category: req.params.id });
      await Blog.deleteMany({ categoryId: req.params.id });
      res.json({ message: 'Category and all related subcategories and blogs deleted' });
    } else {
      const category = await categoryService.updateCategory(req.params.id, { is_deleted: true });
      if (!category) return res.status(404).json({ error: 'Category not found' });
      res.json({ message: 'Category soft deleted' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
