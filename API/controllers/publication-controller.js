'use strict'
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var User = require('../models/user');
var Publication = require('../models/publication');
var Follow = require('../models/follow');

function probando(req, res){
    res.status(200).send({
        message: "Hola desde PUBLICACIONES"
    });
}

module.exports = {
    probando
}