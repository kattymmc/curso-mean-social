'use strict'

var express = require('express');
var FollowController = require('../controllers/follow-controller');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/pruebas-follow', md_auth.ensureAuth, FollowController.pruebas);

module.exports = api;