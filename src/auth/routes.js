'use strict';

const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const { users } = require('./models/index.js');
const basicAuth = require('./middleware/basic.js')
const bearerAuth = require('./middleware/bearer.js')

authRouter.post('/signup', async (request, response, next) => {

  users.beforeCreate(async (user) => {

    let hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;

  });

  try {

    let userRecord = await users.create(request.body);

    const output = {
      user: userRecord,
      token: userRecord.token
    };

    response.status(201).json(output);

  } catch (e) {

    next(e.message);

  }
});

authRouter.post('/signin', basicAuth.basicAuth, (request, response, next) => {
  const user = {
    user: request.user,
    token: request.user.token
  };
  response.status(200).json(user);
});

authRouter.get('/users', basicAuth.basicAuth, async (req, res, next) => {
  const users = await users.findAll({});
  const list = users.map(user => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth.bearerAuth, async (req, res, next) => {
  res.status(200).send("Welcome to the secret area!")
});


module.exports = authRouter;
