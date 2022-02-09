'use strict';
const jwt = require('jsonwebtoken');
const encrypter = require('../utils/encrypter');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Url);
    }

    async comparePassword(rawPassword) {
      return await encrypter.compareEncriptedAsync(rawPassword, this.password);
    }
    async encryptPassword() {
      this.password = await encrypter.encryptAsync(this.password);
    }
    generateAuthToken() {
      const token = jwt.sign(
        {
          id: this.id,
          name: this.name,
        },
        process.env.jwtPrivateKey
      );
      return token;
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
