// Including modules
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  uuid = require('uuid'),
  Joi = require('joi');

const app = express();

// // Defining a user class
class User {
  constructor(id, username, password, email, dob) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.dob = dob;
    this.favorites = null;
  }
}

// Data: Users
let users = [
  {
    id: '123',
    username: 'user123',
    password: 'password123',
    email: 'user123@email.com',
    dob: '12-23-1991',
    favorites: ['Rocky', 'Rocky IV'],
  },
];

// Data: Movies
let movies = [
  {
    id: 1,
    title: 'Rocky',
    year: '1976',
    genre: 'Action',
    director: {
      name: 'John G. Avildsen',
      dob: '12-21-1935',
      dod: '6-16-2017',
      bio:
        'John Guilbert Avildsen was an American film director. He is perhaps best known for directing Rocky, which earned him the Academy Award for Best Director. Other films he directed include Joe, Save the Tiger, The Formula, Neighbors, Lean on Me, Rocky V, 8 Seconds, and the first three The Karate Kid films.',
    },
    imageUrl: '#',
    feature: true,
    description:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla, sequi.',
  },
  {
    id: 2,
    title: 'Rocky II',
    year: '1979',
    genre: 'Boxing',
    director: {
      name: 'Sylvester Stallone',
      dob: '07-06-1946',
      dod: null,
      bio:
        'Sylvester Enzio Stallone is an American actor, director, screenwriter, and producer',
    },
    imageUrl: '#',
    feature: true,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing.',
  },
  {
    id: 3,
    title: 'Rocky III',
    year: '1982',
    genre: 'Sports',
    director: {
      name: 'Sylvester Stallone',
      dob: '07-06-1946',
      dod: null,
      bio:
        'Sylvester Enzio Stallone is an American actor, director, screenwriter, and producer',
    },
    imageUrl: '#',
    feature: true,
    description: 'Lorem ipsum dolor sit amet.',
  },
  {
    id: 4,
    title: 'Rocky IV',
    year: '1985',
    genre: 'Action',
    director: {
      name: 'Sylvester Stallone',
      dob: '07-06-1946',
      dod: null,
      bio:
        'Sylvester Enzio Stallone is an American actor, director, screenwriter, and producer',
    },
    imageUrl: '#',
    feature: true,
    description:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque, error consequuntur.',
  },
  {
    id: 5,
    title: 'Rocky V',
    year: '1990',
    genre: 'Boxing',
    director: {
      name: 'John G. Avildsen',
      dob: '12-21-1935',
      dod: '6-16-2017',
      bio:
        'John Guilbert Avildsen was an American film director. He is perhaps best known for directing Rocky, which earned him the Academy Award for Best Director. Other films he directed include Joe, Save the Tiger, The Formula, Neighbors, Lean on Me, Rocky V, 8 Seconds, and the first three The Karate Kid films.',
    },
    imageUrl: '#',
    feature: true,
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae quo architecto illo error praesentium eum vel soluta nihil mollitia rem!',
  },
];

// Middleware: Logging error responses
app.use(morgan('common'));

// Middleware: Serving static file requests
app.use(express.static('public'));

// Middleware: Error handling
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Middleware:
app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// GET
app.get('/', (req, res) => {
  res.status(200).send('Welcome to fightFlix');
});

// GET: Return a list of all movies to the user
app.get('/api/movies', (req, res) => {
  res.status(200).send(movies);
});

// GET: Return data about a single movie by title to the user
app.get('/api/movies/:title', (req, res) => {
  // Find movie with that title and return 404 if not found
  const result = movies.find((c) => c.title === req.params.title);
  if (!result) return res.status(404).send('Title not found!');

  // Return data about the movie
  res.status(200).send(result);
});

// GET: Return data about a genre
app.get('/api/genres/:genre', (req, res) => {
  // Find movies with that genre and return 404 if not found
  const result = movies.filter((c) => c.genre === req.params.genre);
  if (!result) return res.status(404).send('Genre not found!');

  // Return all movies with the matching genre
  res.status(200).send(result);
});

// GET: Return data about a director (bio, birth year, death year) by name
app.get('/api/directors/:director', (req, res) => {
  // Find director and return 404 if not found
  const director = movies.find((c) => c.director.name === req.params.director);
  if (!director) return res.status(404).send('Director not found!');

  // Returns all information about that director
  res.status(200).send(`Director found successfully!
   Name: ${director.director.name},
   Date of Birth: ${director.director.dob},
   Date of Death: ${director.director.dod},
   Bio: ${director.director.bio}`);
});

// POST: Allow new users to register
app.post('/api/users/', (req, res) => {
  // Check valid user input
  const result = validateUser(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  // Creates new user object
  const user = new User(
    uuid.v4(),
    req.body.username,
    req.body.password,
    req.body.email,
    req.body.dob
  );

  // Adds user to data
  users.push(user);

  // Returns user
  res.status(201).send(`New user added successfully!
  Username: ${user.username},
  Password: ${user.password},
  Email: ${user.email},
  Dob: ${user.dob}`);
});

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).required(),
    password: Joi.string().min(7).required(),
    email: Joi.string().email().required(),
    dob: Joi.date().required(),
  });

  return schema.validate(user);
}

// RETURN LIST OF ALL USERS FOR TESTING
app.get('/api/users/list', (req, res) => {
  res.status(200).send(users);
});

// PUT: Allow users to update their info (username, password, email, date of birth)
app.put('/api/users/:username', (req, res) => {
  // Find user and return 404 if not found
  let user = users.find((c) => c.username === req.params.username);
  if (!user) return res.status(404).send('User does not exist');

  // Update information
  user.username = req.body.username;
  user.password = req.body.password;
  user.email = req.body.email;
  user.dob = req.body.dob;

  res.status(201).send(`User information updated successfully! 
    New username: ${user.username},
    New password: ${user.password},
    New email: ${user.email},
    New dob: ${user.dob}`);
});

// POST: Allow users to add a movie to their list of favorites
app.post('/api/users/:username/favorites/:title', (req, res) => {
  // Find user and return 404 if not found
  let user = users.find((c) => c.username === req.params.username);
  if (!user) return res.status(404).send('User does not exist');

  // Find movie and return 404 if not found
  const result = movies.find((c) => c.title === req.params.title);
  if (!result) return res.status(404).send('Title not found!');

  // Check if movie is already in favorites
  const isFavorite = user.favorites.includes(result.title);
  if (isFavorite)
    return res.status(400).send(`${result.title} is already in favorites!`);

  // Add the movie title to the users list of favorites
  user.favorites.push(result.title);

  res
    .status(201)
    .send(`New favorite movie, ${result.title}, added successfully!`);
});

// DELETE: Allow users to remove a movie from their list of favorites
app.delete('/api/users/:username/favorites/:title', (req, res) => {
  // Find user and return 404 if not found
  let user = users.find((c) => c.username === req.params.username);
  if (!user) return res.status(404).send('User does not exist');

  // Find movie and return 404 if not found
  const result = movies.find((c) => c.title === req.params.title);
  if (!result) return res.status(404).send('Title not found!');

  // Check if movie is actually in favorites list
  const isFavorite = user.favorites.includes(result.title);
  if (!isFavorite)
    return res
      .status(404)
      .send(`There is nothing to remove. ${result.title} is not in favorites.`);

  const index = user.favorites.indexOf(result.title);
  user.favorites.splice(index, 1);

  res.status(200).send(`${result.title} successfully removed from favorites!`);
});

// DELETE?: Allow existing users to deregister
app.delete('/api/users/:username', (req, res) => {
  // Check to see if user actually exists
  let user = users.find((c) => c.username === req.params.username);
  if (!user) return res.status(404).send('User does not exist');

  const index = users.indexOf(user);
  users.splice(index, 1);

  res.status(200).send(`${user.email}'s account removed successfully`);
});

// Listen For Requests with environment variable
const port = process.env.PORT || 8181;
app.listen(port, () => console.log(`Your app is listening on port ${port}...`));
