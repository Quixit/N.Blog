var express = require('express');
var passport = require('passport');
var router = express.Router();

var log = require('../log')(module);

var mongoose = require('../db/mongoose');
var Setting = require('../model/setting');

router.get('/', function(req, res) {

	Setting.find(function (err, settings) {
		if (!err) {
			return res.json(settings);
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

	Setting.findById(req.params.id, function (err, setting) {

		if(!setting) {
			res.statusCode = 404;

			return res.json({
				error: 'Not found'
			});
		}

		if (!err) {
			return res.json({
				status: 'OK',
				setting:setting
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

	var setting = new Setting({
		name: req.body.name,
		value: req.body.value
	});

	setting.save(function (err) {
		if (!err) {
			log.info("New setting created with id: %s", setting.id);
			return res.json({
				status: 'OK',
				setting:setting
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
	var settingId = req.params.id;

	Setting.findById(settingId, function (err, setting) {
		if(!setting) {
			res.statusCode = 404;
			log.error('Setting with id: %s Not Found', settingId);
			return res.json({
				error: 'Not found'
			});
		}

		setting.name = req.body.name;
		setting.value = req.body.value;

		setting.save(function (err) {
			if (!err) {
				log.info("Setting with id: %s updated", setting.id);
				return res.json({
					status: 'OK',
					setting:setting
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
	Setting.remove({ id: req.params.id },function (err) {
		if (!err) {
			log.info("Setting with id: %s deleted", setting.id);
			return res.json({
				status: 'OK',
				setting:setting
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

module.exports = router;
