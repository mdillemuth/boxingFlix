const Users = require('./../../models/Users');
const express = require('express');
const router = express.Router();

// Add a New User Account
router.post('/', (req, res) => {
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

// Update User Information
router.put('/:Username', (req, res) => {
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

// Add a Movie to User's List of Favorites
router.post('/:Username/favorites/:MovieID', (req, res) => {
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

// Remove a Movie from User's Favorites
router.delete('/:Username/favorites/:MovieID', (req, res) => {
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

// Remove a User's Account
router.delete('/:Username', (req, res) => {
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

module.exports = router;
