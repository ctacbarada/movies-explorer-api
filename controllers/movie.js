const Movie = require('../models/movie');
const { NoValidIdError } = require('../errors/NoValidIdError');
const { NoPermissionError } = require('../errors/NoPermissionError');
const { ConflictError } = require('../errors/ConflictError');
const { ValidationError } = require('../errors/ValidationError');
const { CastError } = require('../errors/CastError');

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  Movie.findOne({ movieId: `${movieId + req.user._id}` })
    .then((item) => {
      if (!item) {
        Movie.create({
          country,
          director,
          duration,
          year,
          description,
          image,
          trailerLink,
          nameRU,
          nameEN,
          thumbnail,
          owner: req.user._id,
          movieId: `${movieId + req.user._id}`,
        })
          .then((movie) => {
            res.status(201).send(movie);
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new ValidationError('400 - Incorrect data passed while creating a movie'));
            }
            next(err);
          });
      } else {
        next(new ConflictError('409 - This movie already exists.'));
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new Error('NoValidId'))
    .then(async (movie) => {
      if (movie.owner.toHexString() === req.user._id) {
        await Movie.findByIdAndRemove(req.params.movieId);
        res.status(200).send({ message: 'Film deleted' });
      } else {
        throw new NoPermissionError('403 — Attempting to delete someone else\'s movie');
      }
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NoValidIdError('404 - Movie with specified id not found'));
      } else if (err.name === 'CastError') {
        next(new CastError('404 - Invalid id passed'));
      } else {
        next(err);
      }
    });
};
