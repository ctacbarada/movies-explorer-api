require('dotenv').config();
const server = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const route = require('./routes/index');
const errorHendler = require('./middlewares/errorHandler');
const rateLimit = require('./middlewares/rateLimit');

const { PORT, MONGO } = process.env;
const app = server();
mongoose.connect(MONGO);

app.use(helmet()); // использование Helmet
app.disable('x-powered-by'); // отключить заголовок X-Powered-By
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(requestLogger); // подключаем логгер запросов
app.use(cors); // подключаем cors заголовки

route(app); // Все роуты
rateLimit(app); // Basic rate-limiting middleware for Express

app.use(errorLogger); // errorLogger подключают после обработчиков роутов и до обработчиков ошибок
app.use(errors()); // обработчик ошибок celebrate

errorHendler(app); // здесь обрабатываем все ошибки

app.listen(PORT, () => {
});
