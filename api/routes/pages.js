var express = require('express');
var passport = require('passport');
var router = express.Router();

var log = require('../log')(module);
const util = require('util');

var mongoose = require('../db/mongoose');
var Page = require('../model/page');

router.get('/', passport.authenticate('bearer', { session: false }), function(req, res) {

	Page.find().sort({ title: 1 }).exec(function (err, pages) {
		if (!err) {
			return res.json(pages);
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

	Page.findById(req.params.id, function (err, page) {

		if(!page) {
			res.statusCode = 404;

			return res.json({
				error: 'Not found.'
			});
		}

		if (!err) {
			return res.json({
				status: 'OK',
				page:page
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

	var page = new Page({
		title: req.body.title,
		description: req.body.description,
		content: req.body.content,
		published: req.body.published,
		slug: req.body.slug
	});

	if (req.body.parent != null && req.body.parent !== '')
		page.parent = mongoose.Types.ObjectId(req.body.parent);

	page.save(function (err) {
		if (!err) {
			log.info(util.format("New page created with id: %s", page.id));
			return res.json({
				status: 'OK',
				page:page
			});
		} else {
			if(err.name === 'ValidationError') {
				res.statusCode = 400;
				res.json({
					error: 'Validation error.'
				});
			} else if(err.message.startsWith('E11000')) {
				res.statusCode = 400;
				return res.json({
					error: 'Slug must be unique.'
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
	var pageId = req.params.id;

	Page.findById(pageId, function (err, page) {
		if(!page) {
			res.statusCode = 404;
			log.error(util.format('Page with id: %s Not Found', pageId));
			return res.json({
				error: 'Not found.'
			});
		}

		page.title = req.body.title;
		page.description = req.body.description;
		page.content = req.body.content;
		page.slug = req.body.slug;
		page.published = req.body.published;
		page.modified = new Date();

		if (req.body.parent !== null && req.body.parent !== '' && req.body.parent != pageId) {
			page.parent = mongoose.Types.ObjectId(req.body.parent);
		}
		else {
			page.parent = null;
		}

		page.save(function (err) {
			if (!err) {
				log.info(util.format("Page with id: %s updated", page.id));
				return res.json({
					status: 'OK',
					page:page
				});
			} else {
				if(err.name === 'ValidationError') {
					res.statusCode = 400;
					return res.json({
						error: 'Validation error.'
					});
				}
				else if(err.message.startsWith('E11000')) {
					res.statusCode = 400;
					return res.json({
						error: 'Slug must be unique.'
					});
				} else {
					res.statusCode = 500;

					return res.json({
						error: 'Server error.'
					});
				}
				log.error(util.format('Internal error (%d): %s', res.statusCode, err.message));
			}
		});
	});
});

router.delete('/:id', passport.authenticate('bearer', { session: false }), function (req, res){

	Page.deleteOne({ _id: req.params.id },function (err) {
		if (!err) {
			log.info(util.format("Page with id: %s deleted", req.params.id));
			return res.json({
				status: 'OK'
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
			log.error(util.format('Internal error (%d): %s', res.statusCode, err.message));
		}
	});
});

module.exports = router;
