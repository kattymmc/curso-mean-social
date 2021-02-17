'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Cargar rutas

//  Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors

// Rutas
app.get('/pruebas', (req, res) => {
    res.status(200).send({
        message: 'Mensaje de pruebas Red-social'
    });
});

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Hola mundo desde NodeJS'
    });
});

module.exports = app;