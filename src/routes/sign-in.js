'use strict';

const basicAuth = require('../middleware/basicAuth.js');

async function signIn(request, response) {

  try {

    basicAuth.basicAuth;
   
  } catch (error) {

      response.status(401).send('unauthenticated request');

  }
}

module.exports = {signIn};