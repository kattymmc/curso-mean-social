'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Cargar rutas
var userRoutes = require('./routes/user-routes');

//  Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors


// Rutas -> http://localhost:3800/api/ruta
app.use('/api', userRoutes);

module.exports = app;