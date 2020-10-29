const Movies = require('./../../models/Movies');
const express = require('express');
const router = express.Router();

// Return All Movies
router.get('/', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Return a Single Movie
router.get('/:MovieID', (req, res) => {
  Movies.find({ _id: req.params.MovieID })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Return Movies Containing a Specific Genre
router.get('/genres/:Genre', (req, res) => {
  Movies.find({ 'Genre.Name': `${req.params.Genre}` })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Return Data About a Director
router.get('/directors/:Director', (req, res) => {
  Movies.findOne({ 'Director.Name': `${req.params.Director}` })
    .then((movie) => {
      res.status(201).json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

module.exports = router;
