'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

var jwt = require('../services/jwt');
var User = require('../models/user');
var Follow = require('../models/follow');


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

           // CONTROLAR USUARIOS DUPLICADOS
            User.find({ $or: [
                {email: user.email.toLowerCase()},
                {nick: user.nick.toLowerCase()}
            ]}).exec((err, users) => {
                if(err) return res.status(500).send({ message: 'Error en la petición de usuarios' });

                if(users && users.length >= 1){
                    return res.status(200).send({ message: 'El usuario ya esta registrado' });
                } else {

                    // ENCRIPTAR CONTRASEÑA
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;

                        // GUARDAR USUARIO
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
                }
            });

       } else {
           res.status(200).send({
               message: 'Faltan campos necesarios'
           });
       }
}

function loginUser(req, res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email}, (err, user) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(user){
            bcrypt.compare(password, user.password, (err,check) => {
                if(check){
                    // Si se le pasa el parametro (gettoken: true)
                    if(params.gettoken){
                        // Genera y devuelve token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        })
                    }else{
                        // Devolver datos del usuario
                        user.password = undefined;
                        return res.status(200).send({user});
                    }
                }
                    return res.status(404).send({message: 'El usuario no se ha podido identificar'});
            });
        } else {
            return res.status(404).send({message: 'El usuario no se ha podido identificar'});
        }
    });
}

// PEDIR DATOS DE UN USUARIO SEGUN ID
function getUser(req, res){
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if(err) return res.status(500).send({message: 'Error en la petición'});
        
        if(!user) return res.status(404).send({message: 'El usuario no existe'});
        
        followThisUser(req.user.sub, userId).then((value) => {
            return res.status(200).send({
                user, 
                following: value.following,
                followed: value.followed
            });
        });
    });
}

async function followThisUser(indentity_user_id, user_id){
    try{
        var following = await Follow.findOne({"user":indentity_user_id, "followed":user_id}).exec()
                        .then((following) => {
                            return following;
                        }).catch((err) => {
                            return handleerror(err);
                        })
        
        var followed = await Follow.findOne({"user":user_id, "followed":indentity_user_id}).exec()
                        .then((followed) => {
                            return followed;
                        }).catch((err) => {
                            return handleerror(err);
                        })
        return {
            following: following,
            followed: followed
        };
    }catch(e){
        console.log(e);
    }
}

// PEDIR DATOS DE USUARIOS PAGINADO
function getUsers(req, res){
    var identity_user_id = req.user.sub;
    var page = 1; // si no manda ninguna pagina, por defecto 1
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 5;

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(!users) return res.status(404).send({message: 'No hay usuarios disponibles'});

        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });
    });
}

// EDICION DE DATOS DE USUARIO
function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    // borrar propiedad password si es que pasa como parametro
    delete update.password;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para editar los datos del usuario'});
    }

    User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

        return res.status(200).send({user: userUpdated});
    });
}

function uploadImage(req, res){
    var userId = req.params.id;

    if(req.files){
        var file_path = req.files.image.path; // Devuelve el path donde se guardo la imagen
        console.log(file_path);

        var file_split = file_path.split('\\'); // Devulve un array con las partes del path
        console.log(file_split);

        var file_name = file_split[2]; // Obtener el nombre del archivo
        console.log(file_name);

        var ext_split = file_name.split('\.'); // Separar el nombre del archivo y su extension
        console.log(ext_split);

        var file_ext = ext_split[1]; // Obtener la extension del archivo
        console.log(file_ext);
        
        // Si el usuario no es el mismo del token, le niega el permiso
        if(userId != req.user.sub){
            return removeFilesOfUploads(res, file_path,'No tienes permiso para editar los datos del usuario');
        }

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            // Actualizar documento de usuario logueado
            User.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err, userUpdated) => {
                if(err) return res.status(500).send({message: 'Error en la peticion'});

                if(!userUpdated) return res.status(404).send({message: 'Error en la peticion'});

                return res.status(200).send({user: userUpdated});
            })
        }else{
            return removeFilesOfUploads(res, file_path, 'Extension no válida');
        }
    } else {
        return res.status(200).send({message: 'No se han subido imagenes'});
    }
}

// BORRAR LA IMAGEN SUBIDA 
function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err) => {
        return res.status(200).send({message: message});
    });
}

function getImagenFile(req, res){
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/'+image_file;

    fs.exists(path_file, (exists) => {
        if(exists){
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({message: 'No existe la imagen...'})
        }
    });
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImagenFile
}