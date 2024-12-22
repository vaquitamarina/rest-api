import express, { json } from 'express';
import { randomUUID } from 'node:crypto';
import { validateMovie, validatePartialMovie } from './movies.js';
import movies from './movies.json' with { type: 'json' };
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
app.disable('x-powered-by');

app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:3000'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}));

app.use(json());

app.get('/movies', (req, res) => {
  const { genre, search } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
    return res.json(filteredMovies);
  }
  if (search) {
    const filteredMovies = movies.filter((movie) => movie.title.toLowerCase() === search.toLowerCase());
    return res.json(filteredMovies);
  }
  res.json(movies);
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);
  res.status(404).json({ error: 'Movie not found' });
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body);
  if (result.error) {
    return res.status(400).json({ errors: JSON.parse(result.error.message) });
  }
  const newMovie = {
    id: randomUUID(),
    ...result.data
  }
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body);
  if (result.error) {
    return res.status(400).json({ errors: JSON.parse(result.error.message) });
  }
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data
  }
  movies[movieIndex] = updatedMovie;
  res.json(updatedMovie);

});

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  movies.splice(movieIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});


