'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Publication = require('../models/publication');
var Follow = require('../models/follow');


function probando(req, res){
    res.status(200).send({
        message: "Hola desde MSESSAGES"
    });
}

module.exports ={
    probando
}