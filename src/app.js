require('dotenv').config();
const debug = require('debug')('app:startup');
const createError = require('http-errors');
const express = require('express');
require('express-async-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');

const app = express();


process.on('unhandledRejection', (err) => {
  debug(err);
  throw err;
});

if (app.get('env') == 'development') {
  app.use(logger('dev'));
}

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

require('./middlewares')(app);

require('./routes')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (error, req, res, next) {
  // render the error page
  const statusCode = error.statusCode || 500;
  if (process.env.NODE_ENV == 'development') {
    debug(error);
    return res.__sendFail(statusCode, { error });
  }
  if (statusCode >= 500) {
    error = { message: 'Internal Server Error' };
  }
  res.__sendFail(statusCode, { message: error.message });
});

module.exports = app;
