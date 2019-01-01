var express = require('express');
var passport = require('passport');
var router = express.Router();

var log = require('../log')(module);

var mongoose = require('../db/mongoose');
var Post = require('../model/post');

router.get('/', function(req, res) {

	Post.find(function (err, posts) {
		if (!err) {
			return res.json(posts);
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

	Post.findById(req.params.id, function (err, post) {

		if(!post) {
			res.statusCode = 404;

			return res.json({
				error: 'Not found.'
			});
		}

		if (!err) {
			return res.json({
				status: 'OK',
				post:post
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

	var post = new Post({
		title: req.body.title,
		description: req.body.description,
		content: req.body.content,
		userId: mongoose.Types.ObjectId(req.user.id),
		tags: req.body.tags,
		published: req.body.published,
		slug: req.body.slug
	});

	if (req.body.categoryId != null)
		post.categoryId = mongoose.Types.ObjectId(req.body.categoryId);

	post.save(function (err) {
		if (!err) {
			log.info("New post created with id: %s", post.id);
			return res.json({
				status: 'OK',
				post:post
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
	var postId = req.params.id;

	Post.findById(postId, function (err, post) {
		if(!post) {
			res.statusCode = 404;
			log.error('Post with id: %s Not Found', postId);
			return res.json({
				error: 'Not found.'
			});
		}

		post.title = req.body.title;
		post.description = req.body.description;
		post.content = req.body.content;
		post.tags = req.body.tags;
		post.published = req.body.published;
		post.slug = req.body.slug;
		post.modified = new Date();

		if (req.body.categoryId != null)
			post.categoryId = mongoose.Types.ObjectId(req.body.categoryId);

		post.save(function (err) {
			if (!err) {
				log.info("Post with id: %s updated", post.id);
				return res.json({
					status: 'OK',
					post:post
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
	Post.deleteOne({ _id: req.params.id },function (err) {
		if (!err) {
			log.info("Post with id: %s deleted", req.params.id);
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
			log.error('Internal error (%d): %s', res.statusCode, err.message);
		}
	});
});

module.exports = router;
