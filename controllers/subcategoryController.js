const fs = require('fs');
const path = require('path');
const subcategoryService = require('../services/subcategoryService');

exports.create = async (req, res) => {
  try {
    let data = req.body;
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }
    const subcategory = await subcategoryService.createSubcategory(data);
    res.status(201).json(subcategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    let subcategories;
    if (req.user && req.user.role === 'admin') {
      subcategories = await subcategoryService.getSubcategories();
    } else if (req.user) {
      subcategories = await subcategoryService.getSubcategories({
        $or: [
          { is_deleted: false, is_approved: true },
          { is_deleted: false, author: req.user.username }
        ]
      });
    } else {
      subcategories = await subcategoryService.getSubcategories({ is_deleted: false, is_approved: true });
    }
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const subcategory = await subcategoryService.getSubcategoryById(req.params.id);
    if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByCategory = async (req, res) => {
  try {
    const subcategories = await subcategoryService.getSubcategoriesByCategory(req.params.categoryId);
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let data = req.body;
    let oldImage = null;
    if (req.file) {
      // Find the existing subcategory to get the old image path
      const existing = await subcategoryService.getSubcategoryById(req.params.id);
      if (existing && existing.image) {
        oldImage = path.join(__dirname, '..', existing.image);
      }
      data.image = `/uploads/${req.file.filename}`;
    }
    const subcategory = await subcategoryService.updateSubcategory(req.params.id, data);
    if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
    // Delete old image if new one was uploaded
    if (oldImage) {
      fs.unlink(oldImage, err => { /* ignore error if file doesn't exist */ });
    }
    res.json(subcategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    if (req.user && req.user.role === 'admin') {
      // Hard delete subcategory
      const subcategory = await subcategoryService.deleteSubcategory(req.params.id);
      if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
      // Delete all blogs related to this subcategory
      const Blog = require('../models/Blog');
      await Blog.deleteMany({ subcategoryId: req.params.id });
      res.json({ message: 'Subcategory and all related blogs deleted' });
    } else {
      const subcategory = await subcategoryService.updateSubcategory(req.params.id, { is_deleted: true });
      if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
      res.json({ message: 'Subcategory soft deleted' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
