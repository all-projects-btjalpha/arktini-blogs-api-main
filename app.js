
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const subcategoryRoutes = require('./routes/subcategory');
const blogRoutes = require('./routes/blog');
const { swaggerUi, swaggerSpec } = require('./swagger');
const cors = require('cors');
const NewsRoute = require('./routes/NewRoute');


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/news', NewsRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
