const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ConflictError } = require('../errors/ConflictError');
const { ValidationError } = require('../errors/ValidationError');
const { JWT_SECRET_DEV } = require('../const/const');

const { NODE_ENV, JWT_SECRET_PROD } = process.env;

function findByIdAndUpdate(req, res, next) {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      res.send({ name: user.name, email: user.email });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 —  Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
}

module.exports.signup = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    })
      .then((user) => {
        const data = {
          _id: user._id,
          name: user.name,
          email: user.email,
        };
        res.status(201).send(data);
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('409 - Пользователь с такой почтой уже существует'));
        } else if (err.name === 'ValidationError') {
          next(new ValidationError('400 - Переданы некорректные данные при создании пользователя'));
        } else {
          next(err);
        }
      }));
};

module.exports.signin = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET_PROD : JWT_SECRET_DEV, { expiresIn: '24h' });
      res.send({ token, userId: user._id });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getAboutUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({ name: user.name, email: user.email, user_id: user._id });
    })
    .catch((err) => next(err));
};

module.exports.patchUpdateUser = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        findByIdAndUpdate(req, res, next);
      } else if (user._id.toString() === req.user._id) {
        findByIdAndUpdate(req, res, next);
      } else {
        next(new ConflictError('409 - Пользователь с такой почтой уже существует'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 —  Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};
