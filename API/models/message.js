'use strict'

const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MessageSchema = new Schema({
    text: { type: String },
    viewed: { type: String },
    create_at: { type: String },
    emitter: { type: Schema.ObjectId, ref: 'User' },
    receiver: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Message', MessageSchema);