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

function savePublication(req, res){
    var params = req.body;

    if(!params.text) return res.status(200).send({message: 'Debes enviar un texto'});

    var publication = new Publication();
    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) => {
        if(err) return res.status(500).send({message: 'Error al guardar la publicacion'});

        if(!publicationStored) return res.status(404).send({message: 'La publicacion NO ha sido guardada'});

        return res.status(200).send({publication: publicationStored});
    });
}

function getPublications(req, res){
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Follow.find({user: req.user.sub}).populate('followed').exec((err,follows) => {
        if(err) return res.status(500).send({message: 'Error al devolver el seguimiento'});

        var follows_clean = [];

        follows.forEach((follow) => {
            follows_clean.push(follow.followed);
        });

        Publication.find({user: {"$in": follows_clean}}).sort('-created_at').populate('user')
                    .paginate(page, itemsPerPage, (err, publications, total) => {
                        if(err) return res.status(500).send({message: "Error al devolver publicaciones"});

                        if(!publications) return res.status(404).send({message:'No hay publicaciones'});

                        return res.status(200).send({
                            total_items: total,
                            pages: Math.ceil(total/itemsPerPage),
                            page: page,
                            publications
                        });
                    });
    });
}

function getPublication(req, res){
    var publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {
        if(err) return res.status(500).send({message: 'Error en obtener publicacion'});
        
        if(!publication) return res.status(404).send({message: 'La publicacion no existe'});

        return res.status(200).send({publication});
    })
}

function deletePublication(req, res){
    var publicationId = req.params.id;

    Publication.deleteOne({'user': req.user.sub, '_id': publicationId}).exec((err, publicationDeleted ) => {
        if(err) return res.status(500).send({message: 'Error al borrar publicacion'});

        if(!publicationDeleted.deletedCount) return res.status(404).send({message: 'La publicacion no ha sido borrada'});

        return res.status(200).send({ publicationDeleted, message: 'La publicacion se ha eliminado correctamente'});
    });
}

module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication
}