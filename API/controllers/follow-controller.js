'use strict'

var mongoosePaginate = require('mongoose-pagination');
//var fs = require('fs');
//var path = require('path');

var User = require('../models/user');
var Follow = require('../models/follow');

function pruebas(req, res){
    res.status(200).send({
        message: 'Hola mundo desde FOLLOW'
    });
}

function saveFollow(req, res){
    var params = req.body;

    var follow = new Follow();
    follow.user = req.user.sub; // Guarda el id del usuario que esta en sesión
    follow.followed = params.followed; // Guarda el id pasado como parametro

    follow.save((err, followStored) => {
        if(err) return res.status(500).send({message: 'Error al guardar el follow'});

        if(!followStored) return res.status(404).send({message:'El follow no se ha guardado'});

        return res.status(200).send({follow: followStored});
    });
}

function deleteFollow(req, res){
    var userId = req.user.sub;
    var followId = req.params.id;

    Follow.find({'user': userId, 'followed': followId}).remove(err => {
        if(err) return res.status(500).send({message: 'Error al dejar de seguir'});

        return res.status(200).send({message: 'El follow se ha eliminado'});
    });
}

function getFollowingUsers(req, res){
    var userId = req.user.sub;

    if(req.params.id && req.params.page){
        userId = req.params.id;
    }

    var page = 1;

    if(req.params.page){
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    var itemsPerPage = 4;

    // Populate: te devuelve todo el objeto de usuario con sus datos 
    Follow.find({user: userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follows, total) => {
        if(err) return res.status(500).send({message: 'Error en el servidor'});

        if(!follows) return res.status(404).send({message: 'No estas siguiendo a ningun usuario'});

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            follows
        });
    });
}

module.exports = {
    pruebas,
    saveFollow,
    deleteFollow,
    getFollowingUsers,
}