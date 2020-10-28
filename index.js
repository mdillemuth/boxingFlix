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
app.get('/api/movies/:MovieID', (req, res) => {
  Movies.find({ Title: req.params.MovieID })
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
        res.status(201).json(updatedUser);
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
        res.status(201).json(updatedUser);
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

// function validateUser(user) {
//   const schema = Joi.object({
//     username: Joi.string().min(5).required(),
//     password: Joi.string().min(7).required(),
//     email: Joi.string().email().required(),
//     dob: Joi.date().required(),
//   });

//   return schema.validate(user);
// }

// Find user and return 404 if not found
// let user = users.find((c) => c.username === req.params.username);
// if (!user) return res.status(404).send('User does not exist');

// // Update information
// user.username = req.body.username;
// user.password = req.body.password;
// user.email = req.body.email;
// user.dob = req.body.dob;

// res.status(201).send(user);
