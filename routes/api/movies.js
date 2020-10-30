const Movies = require('./../../models/Movies'),
  express = require('express'),
  passport = require('passport'),
  router = express.Router();

// Enable authentication
const auth = passport.authenticate('jwt', { session: false });

// @route    GET api/movies
// @desc     Get list of all movies
// @access   Private
router.get('/', auth, (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// @route    GET api/movies/:MovieID
// @desc     Get a specific movie by id
// @access   Private
router.get('/:MovieID', auth, (req, res) => {
  Movies.find({ _id: req.params.MovieID })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// @route    GET api/movies/:Genre
// @desc     Get list of movies containing genre
// @access   Private
router.get('/genres/:Genre', auth, (req, res) => {
  Movies.find({ 'Genre.Name': `${req.params.Genre}` })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// @route    GET api/movies/:Director
// @desc     Get data about a specific director
// @access   Private
router.get('/directors/:Director', auth, (req, res) => {
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
