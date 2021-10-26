'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const SECRET = process.env.SECRET || 'secretstringfortesting';

const User = (sequelize, DataTypes) => sequelize.define('User', {

    username: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true },

    password: { 
      type: DataTypes.STRING, 
      allowNull: false, 
    },

    token: {
      type: DataTypes.VIRTUAL,
      get() {
        let payload = {
          username: this.username
        }
        return jwt.sign(payload, SECRET);
      }
    }
  });

  // Basic AUTH: Validating strings (username, password) 
  User.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ username })
    const valid = await bcrypt.compare(password, user.password)
    if (valid) { return user; }
    throw new Error('Invalid User');
  }

  // Bearer AUTH: Validating a token
  User.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, process.env.SECRET);
      const user = this.findOne({ username: parsedToken.username })
      if (user) { return user; }
      throw new Error("User Not Found");
    } catch (e) {
      throw new Error(e.message)
    }
}

module.exports = User;