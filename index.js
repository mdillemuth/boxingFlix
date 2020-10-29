const express = require('express'),
  morgan = require('morgan'),
  methodOverride = require('method-override'),
  uuid = require('uuid'),
  Joi = require('joi'),
  mongoose = require('mongoose');

const app = express();

const connectDB = require('./db');
const Movies = require('./models/Movies');
const Users = require('./models/Users');

// Connecting Database
connectDB();

// Initialize Middleware
app.use(morgan('common'));

// Serving public files
app.use(express.static('public'));

// Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.get('/api/movies/:MovieID', (req, res) => {
  Movies.find({ _id: req.params.MovieID })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// GET: Return all movies containing a specific genre
app.get('/api/movies/genres/:Genre', (req, res) => {
  Movies.find({ 'Genre.Name': `${req.params.Genre}` })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// GET: Return data about a director by name
app.get('/api/movies/directors/:Director', (req, res) => {
  Movies.findOne({ 'Director.Name': `${req.params.Director}` })
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
  Users.findOne({ Username: req.body.Username }).then((user) => {
    if (user) {
      return res.status(400).send(`${req.body.Username} already exists!`);
    } else {
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      })
        .then((user) => {
          res.status(201).json(user);
        })
        .catch((err) => {
          res.status(500).send(`Error: ${err}`);
        });
    }
  });
});

// PUT: Update user info (username, password, email, dob)
app.put('/api/users/:Username', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      } else {
        res.status(201).json(updatedUser);
      }
    }
  );
});

// POST: Add a movie to user's list of favorites
app.post('/api/users/:Username/favorites/:MovieID', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $push: { FavoriteMovies: req.params.MovieID } },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      } else {
        res.status(201).json(updatedUser.FavoriteMovies);
      }
    }
  );
});

// DELETE: Remove a movie from user's list of favorites
app.delete('/api/users/:Username/favorites/:MovieID', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieID } },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      } else {
        res.status(201).json(updatedUser.FavoriteMovies);
      }
    }
  );
});

// DELETE: Remove a user's account
app.delete('/api/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res
          .status(400)
          .send(
            `No account with the username "${req.params.Username}" was found.`
          );
      } else {
        res
          .status(200)
          .send(`${req.params.Username}'s account was successfully deleted.`);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Listen For Requests with environment variable
const port = process.env.PORT || 8181;
app.listen(port, () => console.log(`Your app is listening on port ${port}...`));
