import express from 'express';
import passport from 'passport';

const router = express.Router();

import getLogger from '../log';
const log = getLogger(module);
import util from 'util';

import User from '../model/user';

var passComplexity = function(password: string) {
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

	if (options.upperCase &&  !/[A-Z]/.test(password))
		messages.push("Password must contain at least one upper case letter.");

	if (options.lowerCase &&  !/[a-z]/.test(password))
		messages.push("Password must contain at least one lower case letter.");

	if (options.number &&  !/\d/.test(password))
		messages.push("Password must contain at least one number.");

	if (options.nonAlphaNumeric &&  !/\W/.test(password))
		messages.push("Password must contain at least one non-alphanumeric character.");

	return messages;
};

router.get('/', function(_req, res) {
	User.find({ inactive: false }).select('-salt, -hashedPassword').exec(function (err, users) {
		if (!err) {
			return res.json(users);
		} else {
			res.statusCode = 500;

			log.error(util.format('Internal error(%d): %s',res.statusCode,err.message));

			return res.json({
				error: 'Server error.'
			});
		}
	});
});

router.get('/:id', function(req, res) {

	User.findById(req.params.id).select('-salt, -hashedPassword').exec( function (err, user) {

		if(!user) {
			res.statusCode = 404;

			return res.json({
				error: 'Not found.'
			});
		}

		if (!err) {
			return res.json({
				status: 'OK',
				user:user
			});
		} else {
			res.statusCode = 500;
			log.error(util.format('Internal error(%d): %s',res.statusCode,err.message));

			return res.json({
				error: 'Server error.'
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
			log.info(util.format("New user created with id: %s", user.id));
			return res.json({
				status: 'OK',
				user:user
			});
		} else {
			if(err.name === 'ValidationError') {
				res.statusCode = 400;
				res.json({
					error: 'Validation error.'
				});
			} else {
				res.statusCode = 500;

				log.error(util.format('Internal error(%d): %s', res.statusCode, err.message));

				res.json({
					error: 'Server error.'
				});
			}
		}
	});
});

router.put('/:id', passport.authenticate('bearer', { session: false }), function (req, res){
	var userId = req.params.id;

	User.findById(userId, function (_err, user) {
		if(!user) {
			res.statusCode = 404;
			log.error(util.format('User with id: %s Not Found', userId));
			return res.json({
				error: 'Not found.'
			});
		}

		user.username = req.body.username;
		user.email = req.body.email;
		user.firstName = req.body.firstName;
		user.lastName = req.body.lastName;
		user.modified = new Date();

		if (req.body.password != null && req.body.password != '') {
			var complexity = passComplexity(req.body.password);

			if (complexity.length > 0) {
				return res.json({
					error: complexity.join(' ')
				});
			}

			user.password = req.body.password;
		}

		user.inactive = false;

		user.save(function (err) {
			if (!err) {
				log.info(util.format("User with id: %s updated", user.id));
				return res.json({
					status: 'OK',
					user:user
				});
			} else {
				if(err.name === 'ValidationError') {
					res.statusCode = 400;
					return res.json({
						error: 'Validation error.'
					});
				} else {
					res.statusCode = 500;

					return res.json({
						error: 'Server error.'
					});
				}
			}
		});
	});
});

router.delete('/:id', passport.authenticate('bearer', { session: false }), function (req, res){
	var userId = req.params.id;

	User.findById(userId, function (_err, user) {
		if(!user) {
			res.statusCode = 404;
			log.error(util.format('User with id: %s Not Found', userId));
			return res.json({
				error: 'Not found.'
			});
		}

		user.inactive = true;

		user.save(function (err) {
			if (!err) {
				log.info(util.format("User with id: %s deleted", user.id));
				return res.json({
					status: 'OK',
					user:user
				});
			} else {
				if(err.name === 'ValidationError') {
					res.statusCode = 400;
					return res.json({
						error: 'Validation error.'
					});
				} else {
					res.statusCode = 500;

					return res.json({
						error: 'Server error.'
					});
				}
			}
		});
	});
});

export default router;
