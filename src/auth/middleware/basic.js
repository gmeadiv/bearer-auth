'use strict';

const base64 = require('base-64');
const { users } = require('../models/index.js');
const bcrypt = require('bcrypt');

// module.exports = async (req, res, next) => {

//   if (!req.headers.authorization) { return _authError(); }

//   let basic = req.headers.authorization;

//   let encodedUserPass = basic.split(' ')[1];

//   let decodedUserPass = await base64.decode(encodedUserPass);

//   let [username, pass] = decodedUserPass.split(':');

//   try {
//     let userQuery = await users.findOne({where: { username }});

//     let password = userQuery.password;

//     let isValidPassword = await bcrypt.compare(pass, password);

//     if (isValidPassword) { 
//       res.send(userQuery); 
//       req.user = userQuery;
//       next();
//     }

//   } catch (e) {

//     res.status(403).send('Invalid Login');

//   }

//   function _authError() {
//     res.status(403).send('INVALID LOGIN')
//   }

// }

async function basicAuth(request, response, next){
  
  if (!request.headers.authorization) {
    response.status(403).send('no authorization headers');
  }

  try {

    let authString = request.headers.authorization;

    console.log(authString, '<-- authString --<<')

    let encodedUserPass = authString.split(' ')[1];

    console.log(encodedUserPass, '<-- encodedUserPass --<<')

    let decodedUserPass = base64.decode(encodedUserPass);

    console.log(decodedUserPass, '<-- decodedUserPass --<<')

    let [username, pass] = decodedUserPass.split(':');

    let userQuery = await users.findOne({where: { username }});

    console.log(userQuery, '<-- USER QUERY --<<')

    let password = userQuery.password;

    console.log(pass, '<-- PASS | PASSWORD -->', password)

    let isValidPassword = await bcrypt.compare(pass, password);
   
    if (isValidPassword) {
   
      response.send(userQuery);
      next();
   
    } else {

      response.status(403).send('password doesn\'t match');

    }
   
  } catch (error) {

      response.status(401).send('unauthenticated request');

  }

}

module.exports = {basicAuth};