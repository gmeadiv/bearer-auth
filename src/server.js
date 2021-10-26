'use strict';

const express = require('express');
require('dotenv').config();
const app = express();

const PORT = process.env.PORT;

const logger = require('./middleware/logger.js');
const error404 = require('./error-handlers/404.js');
const signUpFunctions = require('./routes/sign-up.js');
const signInFunctions = require('./routes/sign-in.js');
const bearAuth = require('./middleware/bearAuth.js')
const { db } = require('./models/index.js');

app.use(express.json());
app.use(logger);

app.get('/jokes', bearAuth.bearAuth, (request, response) => {
  response.status(200).send('bearAuth')
  console.log(request)
});

app.post('/signup', signUpFunctions.signUp);
app.post('/signin', signInFunctions.signIn);

app.use(error404);

module.exports = {
  server: app,
  start: db.sync()
  .then(() => {
    app.listen(PORT, () => console.log('server is running on', PORT));
  }).catch(error => {
    console.error('Could not start server', error.message);
  }),
};