'use strict';

const { users } = require('../models/index.js');
const jwt = require('jsonwebtoken');

module.exports = async (request, response, next) => {

  if (!request.headers.authorization) {
    response.status(403).send('no authorization headers');
  }

  try {

    const token = request.headers.authorization.split(' ').pop();

    console.log(token, '<-- TOKEN --<<')

    const validUser = await jwt.verify(token);

    console.log(validUser, '<-- VALID USER --<<');

    let userQuery = await users.findOne({where: { username: validUser}});

    console.log(userQuery, '<-- USER QUERY --<<');
   
    if (userQuery) {
   
      request.user(userQuery);
      response.status(200);
      console.log('BEARER AUTHENTICATION SUCCESS');
   
    } else {

      response.status(403).send('password doesn\'t match');
      console.log('BEARER AUTHENTICATION FAILURE');

    }

  } catch (e) {
    response.status(403).send('Invalid Login');;
  }
}