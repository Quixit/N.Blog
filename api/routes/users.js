var express = require('express');
var passport = require('passport');
var router = express.Router();

var log = require('../log')(module);

var db = require('../db/mongoose');
var User = require('../model/user');

router.get('/', function(req, res) {

	User.find(function (err, users) {
		if (!err) {
			return res.json(users);
		} else {
			res.statusCode = 500;

			log.error('Internal error(%d): %s',res.statusCode,err.message);

			return res.json({
				error: 'Server error'
			});
		}
	});
});

router.get('/:id', function(req, res) {

	User.findById(req.params.id, function (err, user) {

		if(!user) {
			res.statusCode = 404;

			return res.json({
				error: 'Not found'
			});
		}

		if (!err) {
			return res.json({
				status: 'OK',
				user:user
			});
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s',res.statusCode,err.message);

			return res.json({
				error: 'Server error'
			});
		}
	});
});

router.post('/', passport.authenticate('bearer', { session: false }), function(req, res) {

	var user = new User({
		title: req.body.title,
		author: req.body.author,
		description: req.body.description,
		images: req.body.images
	});

	user.save(function (err) {
		if (!err) {
			log.info("New user created with id: %s", user.id);
			return res.json({
				status: 'OK',
				user:user
			});
		} else {
			if(err.name === 'ValidationError') {
				res.statusCode = 400;
				res.json({
					error: 'Validation error'
				});
			} else {
				res.statusCode = 500;

				log.error('Internal error(%d): %s', res.statusCode, err.message);

				res.json({
					error: 'Server error'
				});
			}
		}
	});
});

router.put('/:id', passport.authenticate('bearer', { session: false }), function (req, res){
	var userId = req.params.id;

	User.findById(userId, function (err, user) {
		if(!user) {
			res.statusCode = 404;
			log.error('User with id: %s Not Found', userId);
			return res.json({
				error: 'Not found'
			});
		}

		user.title = req.body.title;
		user.description = req.body.description;
		user.author = req.body.author;
		user.images = req.body.images;

		user.save(function (err) {
			if (!err) {
				log.info("User with id: %s updated", user.id);
				return res.json({
					status: 'OK',
					user:user
				});
			} else {
				if(err.name === 'ValidationError') {
					res.statusCode = 400;
					return res.json({
						error: 'Validation error'
					});
				} else {
					res.statusCode = 500;

					return res.json({
						error: 'Server error'
					});
				}
				log.error('Internal error (%d): %s', res.statusCode, err.message);
			}
		});
	});
});

module.exports = router;
