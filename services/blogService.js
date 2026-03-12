const Blog = require('../models/Blog');

exports.createBlog = async (data) => {
  const blog = new Blog(data);
  return await blog.save();
};

exports.getBlogs = async () => {
  return await Blog.find().populate('category').populate('subcategory');
};

exports.getBlogById = async (id) => {
  return await Blog.findById(id).populate('category').populate('subcategory');
};

exports.updateBlog = async (id, data) => {
  return await Blog.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteBlog = async (id) => {
  return await Blog.findByIdAndDelete(id);
};
