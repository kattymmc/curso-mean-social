'use strict'

const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PublicationSchema = new Schema({
    text: { type: String },
    file: { type: String },
    created_at: { type: String },
    user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Publication', PublicationSchema);