const express = require('express'),
  router = express.Router();

const jwtSecret = 'your_jwt_secret',
  jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./../../passport');

// Encodes username in JWT
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,
    expiresIn: '7d',
    algorithm: 'HS256',
  });
};

// @route    POST api/login
// @desc     Log in user and generate token
// @access   Private
router.post('/', (req, res) => {
  passport.authenticate('local', { session: false }, (error, user, info) => {
    if (error || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user,
      });
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        res.send(error);
      }
      let token = generateJWTToken(user.toJSON());
      return res.json({ user, token });
    });
  })(req, res);
});

module.exports = router;