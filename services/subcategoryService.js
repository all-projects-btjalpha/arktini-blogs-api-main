const Subcategory = require('../models/Subcategory');

exports.createSubcategory = async (data) => {
  const subcategory = new Subcategory(data);
  return await subcategory.save();
};

// exports.getSubcategories = async () => {
//   return await Subcategory.find();
// };
exports.getSubcategories = async () => {
  return await Subcategory.find()
    .populate('category', 'title'); // only fetch category name
};


exports.getSubcategoryById = async (id) => {
  return await Subcategory.findById(id);
};

exports.getSubcategoriesByCategory = async (categoryId) => {
  return await Subcategory.find({ category: categoryId });
};

exports.updateSubcategory = async (id, data) => {
  return await Subcategory.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteSubcategory = async (id) => {
  return await Subcategory.findByIdAndDelete(id);
};
