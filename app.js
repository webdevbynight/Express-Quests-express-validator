require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

const port = process.env.APP_PORT ?? 8000;

const welcome = (req, res) => res.send('Welcome to my favourite movie list');

app.get('/', welcome);

const movieHandlers = require('./movieHandlers'),
    userHandlers = require('./userHandlers');

app.get('/api/movies', movieHandlers.getMovies);
app.get('/api/movies/:id', movieHandlers.getMovieById);
app.get('/api/users', userHandlers.getUsers);
app.get('/api/users/:id', userHandlers.getUsers);
app.post('/api/movies', movieHandlers.validateMovie, movieHandlers.setMovie);
app.post('/api/users', userHandlers.validateUser, userHandlers.setUser);
app.put('/api/movies/:id', movieHandlers.validateMovie, movieHandlers.updateMovie);
app.put('/api/users/:id', userHandlers.validateUser, userHandlers.updateUser);

app.listen(port, err =>
{
    if (err) console.error('Something bad happened');
    else console.log(`Server is listening on ${port}`);
});
