const News = require('../models/News');

exports.createNews = async (data) => {
  const News = new News(data);
  return await News.save();
};

exports.getNews = async () => {
  return await News.find().populate('category').populate('subcategory');
};

exports.getNewsById = async (id) => {
  return await News.findById(id).populate('category').populate('subcategory');
};

exports.updateNews = async (id, data) => {
  return await News.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteNews = async (id) => {
  return await News.findByIdAndDelete(id);
};
