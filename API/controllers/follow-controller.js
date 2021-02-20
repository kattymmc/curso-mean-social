'use strict'

var mongoosePaginate = require('mongoose-pagination');
//var fs = require('fs');
//var path = require('path');

var User = require('../models/user');
var Follow = require('../models/follow');

function pruebaFollow(req, res){
    res.status(200).send({
        message: 'Hola mundo desde FOLLOW'
    });
}

module.exports = {
    pruebaFollow
}