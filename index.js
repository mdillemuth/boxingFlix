const express = require('express'),
  morgan = require('morgan'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  methodOverride = require('method-override'),
  connectDB = require('./db'),
  Movies = require('./models/Movies'),
  Users = require('./models/Users'),
  app = express(),
  { check, validationResult } = require('express-validator');

// CORS
const cors = require('cors');
app.use(cors());

// Passport
const passport = require('passport');
require('./passport');

// Connecting Database
connectDB();

// Middleware
app.use(morgan('common')); // Logging
app.use(express.static('public')); // Serving Static Files
app.use(express.json()); // Parsing
app.use(express.urlencoded({ extended: true })); // Parsing
app.use(methodOverride());
app.use((err, req, res, next) => {
  // Error Handling
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Define Routes
app.get('/', (req, res) => {
  res.status(200).send('Welcome to fightFlix');
});
app.use('/api/login', require('./routes/api/auth'));
app.use('/api/movies', require('./routes/api/movies'));
app.use('/api/users', require('./routes/api/users'));

// Port listening
const port = process.env.PORT || 8181;
app.listen(port, () => console.log(`Your app is listening on port ${port}...`));
