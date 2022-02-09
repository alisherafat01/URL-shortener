require('dotenv').config();
module.exports = {
  development: {
    use_env_variable: 'MYSQL_CONNECTION',
    timezone: '+03:30',
    dialect: 'mysql',
    logQueryParameters: true,
  },
  test: {
    use_env_variable: 'MYSQL_TEST_CONNECTION',
    timezone: '+03:30',
    dialect: 'mysql',
    logQueryParameters: false,
    logging: false,
  },
  production: {
    use_env_variable: 'MYSQL_CONNECTION',
    timezone: '+03:30',
    dialect: 'mysql',
    logQueryParameters: true,
  },
};
