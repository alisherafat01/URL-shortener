module.exports = app => {
  app.use('/auth', require('./auth-routes'));
  app.use('/', require('./url-routes'));
};
