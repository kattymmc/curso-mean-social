'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_del_proyecto_chinchin';

exports.createToken = function(user){
    // iat: momento de creacion del token
    // exp: fecha de expiracion del token (30 dias despues)
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    return jwt.encode(payload,secret);
}