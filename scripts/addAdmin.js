const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
require('dotenv').config();
const User = require('../models/User');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => { console.error(err); process.exit(1); });

function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

(async () => {
  try {
    const email = await ask('Enter admin email: ');
    const password = await ask('Enter admin password: ');
    const username = await ask('Enter admin username: ');
    const requestFor = await ask('Enter requestFor (EquipMedy/Teachercool): ');
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hash,
      username,
      requestFor,
      role: 'admin',
      status: 'approved'
    });
    await user.save();
    console.log('Admin user created successfully!');
  } catch (err) {
    console.error('Error creating admin:', err.message);
  } finally {
    mongoose.disconnect();
    rl.close();
  }
})();
