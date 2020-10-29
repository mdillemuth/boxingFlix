const mongoose = require('mongoose');

// Define Schema for Movies
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
