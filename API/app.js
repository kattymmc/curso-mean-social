'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Cargar rutas
var userRoutes = require('./routes/user-routes');
var followRoutes = require('./routes/follow-routes');
var publicationRoutes = require('./routes/publication-routes');

//  Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors


// Rutas -> http://localhost:3800/api/ruta
app.use('/api', userRoutes);
app.use('/api', followRoutes);
app.use('/api', publicationRoutes);

module.exports = app;