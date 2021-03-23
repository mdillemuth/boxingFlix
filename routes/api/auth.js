const express = require('express'),
  router = express.Router();

const jwtSecret = process.env.fightFlix_jwtPrivateKey;
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('./../../passport');

/**
 * Generates and returns JWT token
 * @param {*} user
 * @returns {string} [the token]
 */

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,
    expiresIn: '7d',
    algorithm: 'HS256',
  });
};

/**
 * /api/login
 *  post
 *  Authenticates user after login
 * @returns {Promise}
 */
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
