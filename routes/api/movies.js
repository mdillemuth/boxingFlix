const Movies = require('./../../models/Movies'),
  express = require('express'),
  passport = require('passport'),
  router = express.Router();

// Commented out for building the front-end
const auth = passport.authenticate('jwt', { session: false });

// @route    GET api/movies
// @desc     Get list of all movies
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const movies = await Movies.find();
    res.status(201).json(movies);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`Server Error: ${error}`);
  }
});

// @route    GET api/movies/:MovieID
// @desc     Get a specific movie by id
// @access   Private
router.get('/:MovieID', auth, async (req, res) => {
  try {
    const movie = await Movies.find({ _id: req.params.MovieID });
    res.status(201).json(movie);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`Server Error: ${error}`);
  }
});

// @route    GET api/movies/:Genre
// @desc     Get list of movies containing genre
// @access   Private
router.get('/genres/:Genre', auth, async (req, res) => {
  try {
    const movie = await Movies.find({ 'Genre.Name': `${req.params.Genre}` });
    res.status(201).json(movie);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`Server Error: ${error}`);
  }
});

// @route    GET api/movies/:Director
// @desc     Get data about a specific director
// @access   Private
router.get('/directors/:Director', auth, async (req, res) => {
  try {
    const movie = await Movies.findOne({
      'Director.Name': `${req.params.Director}`,
    });
    res.status(201).json(movie.Director);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`Server Error: ${error}`);
  }
});

module.exports = router;
