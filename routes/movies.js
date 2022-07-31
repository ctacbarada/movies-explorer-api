const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { REG_LINK } = require('../const/const');

const { getAllMovies, createMovie, deleteMovie } = require('../controllers/movie');

router.get('/movies', getAllMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(30),
    description: Joi.string().required().min(2).max(30),
    image: Joi.string().required().pattern(REG_LINK),
    trailer: Joi.string().required().pattern(REG_LINK),
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
    thumbnail: Joi.string().required().pattern(REG_LINK),
    movieId: Joi.string().required().min(2).max(30),
  }),
}), createMovie);

router.delete('/movies/:movieId', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().required().length(24),
  }),
}), deleteMovie);

module.exports = router;
