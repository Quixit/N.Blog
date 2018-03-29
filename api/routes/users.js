var express = require('express');
var passport = require('passport');
var router = express.Router();

var log = require('../log')(module);

var mongoose = require('../db/mongoose');
var User = require('../model/user');

var passComplexity = function(pass)
{
	var options = {
		length: 8,
		upperCase: true,
		lowerCase: true,
		number: true,
		nonAlphaNumeric: false
	};

	var messages = [];

	if (password.length < options.length)
		messages.push("Password must be at least " + options.length + " characters.");

	if (options.hasUpperCase &&  !/[A-Z]/.test(password))
		messages.push("Password must contain at least one upper case letter.");

	if (options.lowerCase &&  !/[a-z]/.test(password))
		messages.push("Password must contain at least one lower case letter.");

	if (options.number &&  !/\d/.test(password))
		messages.push("Password must contain at least one number.");

	if (options.nonAlphaNumeric &&  !/\W/.test(password))
		messages.push("Password must contain at least one non-alphanumeric character.");

	return messages;
};

router.get('/', passport.authenticate('bearer', { session: false }), function(req, res) {

	User.find({ inactive: false },function (err, users) {
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
	var complexity = passComplexity(req.body.password);

	if (complexity.length > 0) {
		return res.json({
			error: complexity.join(' ')
		});
	}

	var user = new User({
		username: req.body.username,
		email: req.body.email,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: req.body.password,
		inactive: false
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
	var complexity = passComplexity(req.body.password);

	if (complexity.length > 0) {
		return res.json({
			error: complexity.join(' ')
		});
	}

	var userId = req.params.id;

	User.findById(userId, function (err, user) {
		if(!user) {
			res.statusCode = 404;
			log.error('User with id: %s Not Found', userId);
			return res.json({
				error: 'Not found'
			});
		}

		user.username = req.body.username;
		user.email = req.body.email;
		user.firstName = req.body.firstName;
		user.lastName = req.body.lastName;

		if (req.body.password != null)
			user.password = req.body.password;

		user.inactive = false;

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

router.delete('/:id', passport.authenticate('bearer', { session: false }), function (req, res){
	var userId = req.params.id;

	User.findById(userId, function (err, user) {
		if(!user) {
			res.statusCode = 404;
			log.error('User with id: %s Not Found', userId);
			return res.json({
				error: 'Not found'
			});
		}

		user.inactive = true;

		user.save(function (err) {
			if (!err) {
				log.info("User with id: %s deleted", user.id);
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
