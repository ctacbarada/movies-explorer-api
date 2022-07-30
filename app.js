require('dotenv').config();
const server = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { signup, signin } = require('./controllers/users');
const { PageNotFoundError } = require('./errors/PageNotFoundError');

const app = server();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(helmet()); // использование Helmet
app.disable('x-powered-by'); // отключить заголовок X-Powered-By
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(requestLogger); // подключаем логгер запросов
app.use(cors); // подключаем cors заголовки

app.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), signup);

app.use('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), signin);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/movies'));

app.use(errorLogger); // подключаем логгер ошибок
// errorLogger нужно подключить после
// обработчиков роутов и до обработчиков ошибок
app.use(errors()); // обработчик ошибок celebrate

app.use((req, res, next) => {
  next(new PageNotFoundError('404 - Страницы не существует'));
});
app.use((err, req, res, next) => { // здесь обрабатываем все ошибки
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
  next();
});

app.listen(PORT, () => {
});
