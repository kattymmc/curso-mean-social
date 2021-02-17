'use strict'

var User = require('../models/user');

// Rutas
function home(req, res){
    res.status(200).send({
        message: 'Mensaje de pruebas Red-social'
    });
}

function pruebas(req, res){
    res.status(200).send({
        message: 'Hola mundo desde NodeJS'
    });
}

module.exports = {
    home,
    pruebas
}