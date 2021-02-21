'use strict'

var express = require('express');
var FollowController = require('../controllers/follow-controller');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/pruebas-follow', md_auth.ensureAuth, FollowController.pruebas);
api.post('/follow', md_auth.ensureAuth, FollowController.saveFollow);
api.delete('/follow/:id', md_auth.ensureAuth, FollowController.deleteFollow);
api.get('/following/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowingUsers);
api.get('/followed/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowedUsers);

module.exports = api;