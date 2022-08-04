const router = require('express').Router();

const { getAllMovies, createMovie, deleteMovie } = require('../controllers/movie');
const { postMovies, deleteMovies } = require('../utils/moviesValidation');

router.get('/movies', getAllMovies);

router.post('/movies', postMovies, createMovie);

router.delete('/movies/:movieId', deleteMovies, deleteMovie);

module.exports = router;
