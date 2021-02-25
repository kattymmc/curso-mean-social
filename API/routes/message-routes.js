'use strict'

var express = require('express');
var MessageController = require('../controllers/message-controller');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/pruebas-message', md_auth.ensureAuth, MessageController.probando);
api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/my-messages/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/messages/:page?', md_auth.ensureAuth, MessageController.getEmmitMessages);

module.exports = api;