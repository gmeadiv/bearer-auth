'use strict';

const { users } = require('../models/index.js');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || 'secretstringfortesting';

async function bearAuth(request, response, next){
  
  if (!request.headers.authorization) {
    response.status(403).send('no authorization headers');
  }

  try {

    let authString = request.headers.authorization;

    let encodedToken = authString.split(' ')[1];

    let validUser = jwt.verify(encodedToken, SECRET)
   
    let userQuery = await users.findOne({where: { username: validUser}});
   
    if (userQuery) {
   
      request.user(userQuery);
      response.status(200);
      console.log('BEARER AUTHENTICATION SUCCESS');
   
    } else {

      response.status(403).send('password doesn\'t match');
      console.log('BEARER AUTHENTICATION FAILURE');

    }
   
  } catch (error) {

      response.status(401).send('unauthenticated request');
      console.log('BEARER AUTHENTICATION FAILURE');


  }

}

module.exports = {bearAuth};