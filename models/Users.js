const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define Schema for Users
const userSchema = new mongoose.Schema({
  Username: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

// Hashing password
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// Don't use arrow function because of 'this'
// Comparing hashed passwords
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

// Create User Model
let User = mongoose.model('User', userSchema);

module.exports = User;
