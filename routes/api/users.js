const Users = require('./../../models/Users'),
  express = require('express'),
  passport = require('passport'),
  router = express.Router();

const { check, validationResult } = require('express-validator');

const auth = passport.authenticate('jwt', { session: false });

// @route    POST api/users
// @desc     Register a new user account
// @access   Public
router.post(
  '/',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username can only contain alphanumeric characters.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Invalid email').isEmail(),
  ],
  async (req, res) => {
    // Validation
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Hashing password
    let hashedPassword = Users.hashPassword(req.body.Password);

    try {
      // Checking if user exists
      let user = await Users.findOne({ Username: req.body.Username });

      if (user) {
        return res.status(400).send('User already exists');
      } else {
        // Create user account
        user = await Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        });
        res.status(201).json(user);
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send(`Server Error: ${error}`);
    }
  }
);

// @route    PUT api/users/:Username
// @desc     Update user information
// @access   Private
router.put(
  '/:Username',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username can only contain alphanumeric characters.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Invalid email').isEmail(),
  ],
  auth,
  async (req, res) => {
    // Validation
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      // Find user account
      let user = await Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
          // Update fields
          $set: {
            Username: req.body.Username,
            Password: Users.hashPassword(req.body.Password),
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          },
        },
        { new: true }
      );
      res.status(201).json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send(`Server Error: ${error}`);
    }
  }
);

// @route    POST api/users/:Username/:MovieID
// @desc     Add a movie to user's favorites
// @access   Private
router.post('/:Username/:MovieID', auth, async (req, res) => {
  try {
    let user = await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    );
    res.status(201).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`Server Error: ${error}`);
  }
});

// @route    DELETE api/users/:Username/:MovieID
// @desc     Remove a movie from user's favorites
// @access   Private
router.delete('/:Username/:MovieID', auth, async (req, res) => {
  try {
    let user = await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    );
    res.status(201).send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`Server Error: ${error}`);
  }
});

// @route    DELETE api/users/:Username
// @desc     Remove a user's account
// @access   Private
router.delete('/:Username', auth, async (req, res) => {
  try {
    let user = await Users.findOneAndRemove({ Username: req.params.Username });
    if (!user) {
      res
        .status(400)
        .send(`No account with username ${req.params.Username} was found.`);
    } else {
      res
        .status(200)
        .send(`${req.params.Username}'s account was successfully deleted!`);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`Server Error: ${error}`);
  }
});

module.exports = router;
