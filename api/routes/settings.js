var express = require('express');
var passport = require('passport');
var router = express.Router();

var log = require('../log')(module);
const util = require('util');

var mongoose = require('../db/mongoose');
var Setting = require('../model/setting');

router.get('/', function(req, res) {

	Setting.find(function (err, settings) {
		if (!err) {
			return res.json(settings);
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

	Setting.findById(req.params.id, function (err, setting) {

		if(!setting) {
			res.statusCode = 404;

			return res.json({
				error: 'Not found.'
			});
		}

		if (!err) {
			return res.json({
				status: 'OK',
				setting:setting
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
	var promises = [];

	for (let i = 0; i < req.body.length; i++) {
		var item = req.body[i];

		promises.push(new Promise(function(resolve, reject) {
			Setting.findOne({ name: item.name }, function (err, setting) {
				if(setting) {
					setting.name = item.name;
					setting.value = item.value;
				}
				else {
					setting = new Setting({
						name: item.name,
						value: item.value
					});
				}

				setting.save(function (err) {
					if (err) {
						log.error(util.format('Internal error (%d): %s', 500, err.message));
						reject(err);
					}
					else {
						log.info(util.format("Setting with id: %s updated", setting.id));
						resolve(err);
					}
				});
			});
		}));
	}

	Promise.all(promises).then(function(values) {
		return res.json({
			status: 'OK'
		});
	}).catch(error => {
		res.statusCode = 500;

		return res.json({
			error: 'Server error.'
		});
	});
});

module.exports = router;
