'use strict'

var express = require('express');
var MessageController = require('../controllers/message-controller');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/pruebas-message', md_auth.ensureAuth, MessageController.probando);

module.exports = api;