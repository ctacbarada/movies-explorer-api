const mongoose = require('mongoose');
const { REG_LINK } = require('../const/const');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: (val) => REG_LINK.test(val),
  },
  trailerLink: {
    type: String,
    required: true,
    validate: (val) => REG_LINK.test(val),
  },
  thumbnail: {
    type: String,
    required: true,
    validate: (val) => REG_LINK.test(val),
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
  },
});

module.exports = mongoose.model('movie', movieSchema);
