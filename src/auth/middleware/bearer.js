'use strict';

const { users } = require('../models/index.js');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

async function bearerAuth(request, response, next) {

  if (!request.headers.authorization) {
    response.status(403).send('no authorization headers');
  }

  try {

    const token = request.headers.authorization.split(' ').pop();

    console.log(token, '<-- TOKEN --<<')

    const validUser = await jwt.verify(token, SECRET);

    console.log(validUser, '<-- VALID USER --<<');

    let userQuery = await users.findOne({where: { username: validUser.username}});

    console.log(userQuery, '<-- USER QUERY --<<');
   
    if (userQuery) {
   
      response.send(userQuery);
      response.status(200);
      console.log('BEARER AUTHENTICATION SUCCESS');
   
    } else {

      response.status(403);
      console.log('BEARER AUTHENTICATION FAILURE');

    }

  } catch (error) {
    response.status(403).send(error);
  }
}

module.exports = {bearerAuth}