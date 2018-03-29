var express = require('express');
var passport = require('passport');
var router = express.Router();

var log = require('../log')(module);

var mongoose = require('../db/mongoose');
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
		description: req.body.description,
		content: req.body.content,
		published: req.body.published,
		list: req.body.list,
		slug: req.body.slug,
		published: req.body.published
	});

	if (req.parent != null)
		page.parent = mongoose.Types.ObjectId(req.parent);

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
		page.content = req.body.content;
		page.published = req.body.published;
		page.list = req.body.list;
		page.slug = req.body.slug;
		page.published = req.body.published;
		page.modified = Date.now;

		if (req.parent != null) {
			page.parent = mongoose.Types.ObjectId(req.parent);
		}
		else {
			page.parent = null;
		}

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

router.delete('/:id', passport.authenticate('bearer', { session: false }), function (req, res){
	Page.remove({ id: req.params.id },function (err) {
		if (!err) {
			log.info("Page with id: %s deleted", setting.id);
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
