var express = require('express');
var passport = require('passport');
var router = express.Router();

var log = require('../log')(module);

var mongoose = require('../db/mongoose');
var Category = require('../model/category');
var Post = require('../model/post');

router.get('/', function(req, res) {

	Category.find(function (err, categorys) {
		if (!err) {
			return res.json(categorys);
		} else {
			res.statusCode = 500;

			log.error('Internal error(%d): %s',res.statusCode,err.message);

			return res.json({
				error: 'Server error.'
			});
		}
	});
});

router.get('/:id', function(req, res) {

	Category.findById(req.params.id, function (err, category) {

		if(!category) {
			res.statusCode = 404;

			return res.json({
				error: 'Not found.'
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
				error: 'Server error.'
			});
		}
	});
});

router.post('/', passport.authenticate('bearer', { session: false }), function(req, res) {

	var category = new Category({
		name: req.body.name,
		description: req.body.description,
		content: req.body.content
	});

	if (req.body.parent != null)
		category.parent = mongoose.Types.ObjectId(req.body.parent);

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
					error: 'Validation error.'
				});
			} else {
				res.statusCode = 500;

				log.error('Internal error(%d): %s', res.statusCode, err.message);

				res.json({
					error: 'Server error.'
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
				error: 'Not found.'
			});
		}

		category.name = req.body.name;
		category.description = req.body.description;
		category.content = req.body.content;

		if (req.body.parent != null) {
			category.parent = mongoose.Types.ObjectId(req.body.parent);
		}
		else {
			category.parent = null;
		}

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
						error: 'Validation error.'
					});
				} else {
					res.statusCode = 500;

					return res.json({
						error: 'Server error.'
					});
				}
				log.error('Internal error (%d): %s', res.statusCode, err.message);
			}
		});
	});
});

router.delete('/:id', passport.authenticate('bearer', { session: false }), function (req, res){
	let queryId = mongoose.Types.ObjectId(req.id);

	Post.find({ categoryId : queryId},function (err, posts) {
		if (!err) {
			for (var i = 0; i < posts.length; i++)
			{
				posts[i].categoryId = null;
				post[i].save(function (err) {
					if (!err) {
						log.info("Post with id: %s category removed.", category.id);
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
						log.error('Internal error (%d): %s', res.statusCode, err.message);
					}
				});
			}

			Category.deleteOne({ _id: req.params.id },function (err) {
				if (!err) {
					log.info("Category with id: %s deleted", setting.id);
					return res.json({
						status: 'OK',
						setting:setting
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
					log.error('Internal error (%d): %s', res.statusCode, err.message);
				}
			});
		} else {
			res.statusCode = 500;

			log.error('Internal error(%d): %s',res.statusCode,err.message);

			return res.json({
				error: 'Server error.'
			});
		}
	});


});

module.exports = router;
