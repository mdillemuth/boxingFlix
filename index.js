// Including modules from npm packages
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  uuid = require('uuid'),
  Joi = require('joi'),
  mongoose = require('mongoose');

// Initializing express
const app = express();

// Including original module for database/mongoose
const Models = require('./models.js');

// Classes that apply movie & user schema
const Movies = Models.Movie;
const Users = Models.User;
const connectDB = Models.connectDB;

// Connecting Database
connectDB();

// Middleware: Logging error responses
app.use(morgan('common'));

// Middleware: Serving static file requests
app.use(express.static('public'));

// Middleware: Error handling
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Middleware:
app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// GET
app.get('/', (req, res) => {
  res.status(200).send('Welcome to fightFlix');
});

// GET: Return a list of all movies to the user
app.get('/api/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// GET: Return data about a single movie by title to the user
app.get('/api/movies/:title', (req, res) => {
  Movies.find({ Title: req.params.title })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// GET: Return all movies containing a specific genre
app.get('/api/movies/genres/:genre', (req, res) => {
  Movies.find({ 'Genre.Name': `${req.params.genre}` })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// GET: Return data about a director (bio, birth year, death year) by name
app.get('/api/movies/directors/:director', (req, res) => {
  Movies.findOne({ 'Director.Name': `${req.params.director}` })
    .then((movie) => {
      res.status(201).json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// POST: Add a new user
app.post('/api/users/', (req, res) => {
  // Check valid user input
  const result = validateUser(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  // Creates new user object
  const user = new User(
    uuid.v4(),
    req.body.username,
    req.body.password,
    req.body.email,
    req.body.dob
  );

  // Adds user to data & return user
  users.push(user);
  res.status(201).send(user);
});

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).required(),
    password: Joi.string().min(7).required(),
    email: Joi.string().email().required(),
    dob: Joi.date().required(),
  });

  return schema.validate(user);
}

// PUT: Update user info (username, password, email, dob)
app.put('/api/users/:username', (req, res) => {
  // Find user and return 404 if not found
  let user = users.find((c) => c.username === req.params.username);
  if (!user) return res.status(404).send('User does not exist');

  // Update information
  user.username = req.body.username;
  user.password = req.body.password;
  user.email = req.body.email;
  user.dob = req.body.dob;

  res.status(201).send(user);
});

// POST: Allow users to add a movie to their list of favorites
app.post('/api/users/:username/favorites/:title', (req, res) => {
  // Find user and return 404 if not found
  let user = users.find((c) => c.username === req.params.username);
  if (!user) return res.status(404).send('User does not exist');

  // Find movie and return 404 if not found
  const result = movies.find((c) => c.title === req.params.title);
  if (!result) return res.status(404).send('Title not found!');

  // Check if movie is already in favorites
  const isFavorite = user.favorites.includes(result.title);
  if (isFavorite)
    return res.status(400).send(`${result.title} is already in favorites!`);

  // Add the movie title to the users list of favorites
  user.favorites.push(result.title);

  res
    .status(201)
    .send(`New favorite movie, ${result.title}, added successfully!`);
});

// DELETE: Allow users to remove a movie from their list of favorites
app.delete('/api/users/:username/favorites/:title', (req, res) => {
  // Find user and return 404 if not found
  let user = users.find((c) => c.username === req.params.username);
  if (!user) return res.status(404).send('User does not exist');

  // Find movie and return 404 if not found
  const result = movies.find((c) => c.title === req.params.title);
  if (!result) return res.status(404).send('Title not found!');

  // Check if movie is actually in favorites list
  const isFavorite = user.favorites.includes(result.title);
  if (!isFavorite)
    return res
      .status(404)
      .send(`There is nothing to remove. ${result.title} is not in favorites.`);

  const index = user.favorites.indexOf(result.title);
  user.favorites.splice(index, 1);

  res.status(200).send(`${result.title} successfully removed from favorites!`);
});

// DELETE?: Allow existing users to deregister
app.delete('/api/users/:username', (req, res) => {
  // Check to see if user actually exists
  let user = users.find((c) => c.username === req.params.username);
  if (!user) return res.status(404).send('User does not exist');

  const index = users.indexOf(user);
  users.splice(index, 1);

  res.status(200).send(`${user.email}'s account removed successfully`);
});

// Listen For Requests with environment variable
const port = process.env.PORT || 8181;
app.listen(port, () => console.log(`Your app is listening on port ${port}...`));
