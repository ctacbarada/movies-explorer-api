const Movie = require('../models/movie');
const { NoValidId } = require('../errors/NoValidId');
const { NoPermission } = require('../errors/NoPermission');

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
      console.log(err);
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      const owner = movie.owner.toHexString();
      if (!movie) {
        next(new NoValidId('404 - Фильм с указанным _id не найдена'));
      } else if (owner === req.user._id) {
        Movie.findByIdAndRemove(req.params.movieId)
          .orFail(new Error('NoValidId'))
          .then((movieDeleted) => res.send(movieDeleted))
          .catch((err) => {
            if (err.message === 'NoValidId') {
              next(new NoValidId('404 - Фильм с указанным _id не найдена'));
            } else {
              next(err);
            }
          });
      } else {
        next(new NoPermission('403 — попытка удалить чужую карточку;'));
      }
    });
};
