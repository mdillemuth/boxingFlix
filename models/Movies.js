const mongoose = require('mongoose');

// Create Movie Schema
let movieSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

// Create Movie Model
let Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
