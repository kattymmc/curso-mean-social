'use strict'

const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    name: { type: String },
    surname: { type: String },
    nick: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String },
    image: { type: String }
});

module.exports = mongoose.model('User', UserSchema);