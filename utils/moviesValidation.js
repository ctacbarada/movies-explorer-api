const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

module.exports.postMovies = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Неправильная ссылка');
    }),
    trailerLink: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Неправильная ссылка');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Неправильная ссылка');
    }),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string(),
  }),
});

module.exports.deleteMovies = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});
