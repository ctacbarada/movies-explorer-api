const Movie = require('../models/movie');
const { NoValidIdError } = require('../errors/NoValidIdError');
const { NoPermissionError } = require('../errors/NoPermissionError');
const { ValidationError } = require('../errors/ValidationError');

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send(movie))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
    movieId,
  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 - Переданы некорректные данные при создании фильма'));
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new Error('NoValidId'))
    .then((movie) => {
      if (movie.owner.toHexString() === req.user._id) {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((movieDeleted) => res.send(movieDeleted));
      } else {
        next(new NoPermissionError('403 — попытка удалить чужой фильм;'));
      }
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NoValidIdError('404 - Фильм с указанным _id не найдена'));
      } else {
        next(err);
      }
    });
};
