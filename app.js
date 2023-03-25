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
const { MONGO_DEV } = require('./const/const');

const { MONGO_PROD, NODE_ENV } = process.env;
const PORT = process.env.PORT || 8080;

const app = server();
rateLimit(app); // Basic rate-limiting middleware for Express

mongoose.connect(NODE_ENV === 'production' ? MONGO_PROD : MONGO_DEV);

app.use(helmet());
/* Using Helmet to secure the app */
app.disable('x-powered-by');
/* Disable header X-Powered-By */
app.use(bodyParser.json());
/* to collect JSON format data */
app.use(bodyParser.urlencoded({ extended: true }));
/* For receiving web pages inside a POST request */
app.use(requestLogger); /* Connect request logger */
app.use(cors); /* Include cors headers */

route(app); /* All routes are defined here */

app.use(errorLogger); /* ErrorLogger is connected after route handlers and before error handlers */
app.use(errors()); /* Celebrate error handler */

errorHendler(app); /* Handle all errors here */

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
