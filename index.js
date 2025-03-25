const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bycrypt = require('bcryptjs');
const User = require('./schema');
const connectDB = require('./database');
dotenv.config();
const app = express();

app.use(bodyParser.json());

PORT = process.env.PORT || 3000;
connectDB();
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send('Please provide all fields');
    }
    const SaltRounds = 10;
    const salt = await bycrypt.genSalt(SaltRounds);
    const hashedPassword = await bycrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(400).send('Error registering user');
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('Please provide all fields');
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('User not found');
    }
    const isMatch = await bycrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }
    res.status(200).send('Login successful');
  } catch (error) {
    res.status(400).send('Error logging in');
  }
});
app.listen(PORT, () => 
  console.log(`Server is running on port http://localhost:${PORT}`));