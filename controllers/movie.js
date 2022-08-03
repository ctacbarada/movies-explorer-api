const Movie = require('../models/movie');
const { NoValidIdError } = require('../errors/NoValidIdError');
const { NoPermissionError } = require('../errors/NoPermissionError');
const { ValidationError } = require('../errors/ValidationError');
const { CastError } = require('../errors/CastError');

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send(movie))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

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
    .then(async (movie) => {
      if (movie.owner.toHexString() === req.user._id) {
        await Movie.remove();
        res.status(200).send({ message: 'Фильм удален' });
      }
      throw new NoPermissionError('403 — Попытка удалить чужой фильм');
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NoValidIdError('404 - Фильм с указанным id не найдена'));
      } else if (err.name === 'CastError') {
        next(new CastError('404 - Передан невалидный id'));
      } else {
        next(err);
      }
    });
};
