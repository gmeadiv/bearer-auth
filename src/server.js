'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const authRoutes = require('./auth/routes.js');
const { db } = require('./auth/models/index.js');

// Prepare the express app
const app = express();

require('dotenv').config();
const PORT = process.env.PORT;

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(authRoutes);

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: db.sync()
  .then(() => {
    app.listen(PORT, () => console.log('server is running on', PORT));
  }).catch(error => {
    console.error('Could not start server', error.message);
  }),
};