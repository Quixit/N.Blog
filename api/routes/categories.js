var express = require('express');
var passport = require('passport');
var router = express.Router();

var log = require('../log')(module);

var db = require('../db/mongoose');
var Category = require('../model/category');

router.get('/', function(req, res) {

	Category.find(function (err, categorys) {
		if (!err) {
			return res.json(categorys);
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

	Category.findById(req.params.id, function (err, category) {

		if(!category) {
			res.statusCode = 404;

			return res.json({
				error: 'Not found'
			});
		}

		if (!err) {
			return res.json({
				status: 'OK',
				category:category
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

	var category = new Category({
		title: req.body.title,
		author: req.body.author,
		description: req.body.description,
		images: req.body.images
	});

	category.save(function (err) {
		if (!err) {
			log.info("New category created with id: %s", category.id);
			return res.json({
				status: 'OK',
				category:category
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
	var categoryId = req.params.id;

	Category.findById(categoryId, function (err, category) {
		if(!category) {
			res.statusCode = 404;
			log.error('Category with id: %s Not Found', categoryId);
			return res.json({
				error: 'Not found'
			});
		}

		category.title = req.body.title;
		category.description = req.body.description;
		category.author = req.body.author;
		category.images = req.body.images;

		category.save(function (err) {
			if (!err) {
				log.info("Category with id: %s updated", category.id);
				return res.json({
					status: 'OK',
					category:category
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
