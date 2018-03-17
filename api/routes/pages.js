var express = require('express');
var passport = require('passport');
var router = express.Router();

var log = require('../log')(module);

var db = require('../db/mongoose');
var Page = require('../model/page');

router.get('/', function(req, res) {

	Page.find(function (err, pages) {
		if (!err) {
			return res.json(pages);
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

	Page.findById(req.params.id, function (err, page) {

		if(!page) {
			res.statusCode = 404;

			return res.json({
				error: 'Not found'
			});
		}

		if (!err) {
			return res.json({
				status: 'OK',
				page:page
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

	var page = new Page({
		title: req.body.title,
		author: req.body.author,
		description: req.body.description,
		images: req.body.images
	});

	page.save(function (err) {
		if (!err) {
			log.info("New page created with id: %s", page.id);
			return res.json({
				status: 'OK',
				page:page
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
	var pageId = req.params.id;

	Page.findById(pageId, function (err, page) {
		if(!page) {
			res.statusCode = 404;
			log.error('Page with id: %s Not Found', pageId);
			return res.json({
				error: 'Not found'
			});
		}

		page.title = req.body.title;
		page.description = req.body.description;
		page.author = req.body.author;
		page.images = req.body.images;

		page.save(function (err) {
			if (!err) {
				log.info("Page with id: %s updated", page.id);
				return res.json({
					status: 'OK',
					page:page
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
