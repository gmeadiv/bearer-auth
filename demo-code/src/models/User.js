'use strict';

const jwt = require('jsonwebtoken');

const User = (sequelize, DataTypes) => sequelize.define('User', {

  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  token: {
    type: DataTypes.VIRTUAL,
    get() {
      let payload = {
        username: this.username,
      }
      return jwt.sign(payload, SECRET)
    }
  }
  
});

module.exports = User;