var express = require('express');
var router = express.Router();

var oauth2 = require('../auth/oauth2');

var categories = require('./categories');
var pages = require('./pages');
var posts = require('./posts');
var settings = require('./settings');
var users = require('./users');
var files = require('./files');

router.use('/api/token', oauth2.token);

router.use('/api/categories', categories);
router.use('/api/pages', pages);
router.use('/api/posts', posts);
router.use('/api/settings', settings);
router.use('/api/users', users);
router.use('/api/files', files);

module.exports = router;
