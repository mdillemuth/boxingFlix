const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override');

const app = express();

let topMovies = [
  {
    name: 'Rocky',
    year: '1976',
  },
  {
    name: 'Creed',
    year: '2015',
  },
  {
    name: 'Ali',
    year: '2001',
  },
  {
    name: 'Raging Bull',
    year: '1980',
  },
  {
    name: 'The Boxer',
    year: '1997',
  },
  {
    name: 'Fat City',
    year: '1972',
  },
  {
    name: 'Fight Club',
    year: '2001',
  },
  {
    name: 'Cinderella Man',
    year: '2005',
  },
  {
    name: 'Million Dollar Baby',
    year: '2004',
  },
  {
    name: 'The Fighter',
    year: '2010',
  },
];

// Logging
app.use(morgan('common'));

// Serving static file requests
app.use(express.static('public'));

// Error Handling
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to fightFlix');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// Listen For Requests
app.listen(8080, () => console.log('Your app is listening on port 8080.'));
