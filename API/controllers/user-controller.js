'use strict'
var bcrypt = require('bcrypt-nodejs');

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

function saveUser(req, res){
    var params = req.body;
    var user = new User();

    if(params.name && params.surname &&
       params.nick && params.email && params.password){
           user.name = params.name;
           user.surname = params.surname;
           user.nick = params.nick;
           user.email = params.email;
           user.role = 'ROLE_USER';
           user.image = null;

           // Encriptar contraseña
           bcrypt.hash(params.password, null, null, (err, hash) => {
               user.password = hash;
               // Guardar usuario
               user.save((err, userStored) => {
                   if(err) return res.status(500).send({
                       message: 'Error al guardar el usuario'
                   });
                   if(userStored){
                       res.status(200).send({user: userStored});
                   } else {
                       res.status(404).send({message: 'No se ha registrao al usuario'})
                   }
               });
           });
       } else {
           res.status(200).send({
               message: 'Faltan campos necesarios'
           });
       }
}

module.exports = {
    home,
    pruebas,
    saveUser
}